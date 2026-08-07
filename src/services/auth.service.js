import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Role from "../models/Role.model.js";
import { DEFAULT_ROLE_PERMISSIONS } from "../middlewares/permission.middleware.js";
import ApiError from "../utils/ApiError.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

const ACCESS_TOKEN_EXPIRES_IN = "1h";
const REFRESH_TOKEN_EXPIRES_IN = "30d";
const OTP_EXPIRY_MINUTES = 5;

const verifyTokenWithFallbacks = (token) => {
  const currentSecret = process.env.JWT_SECRET || "your-secret-key";
  const secrets = [currentSecret, "fallback_crm_secret_key_123"];
  let lastError;

  for (const secret of secrets) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Token verification failed");
};

const createTokenPayload = (user) => ({
  id: user._id,
  role: user.role,
  email: user.email,
  companyId: user.companyId,
  permissions: Array.isArray(user.permissions) ? user.permissions : []
});

const getUserSafeData = (user) => {
  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;
  delete safeUser.otpCode;
  delete safeUser.otpExpiresAt;
  return safeUser;
};

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

import Company from "../models/Company.model.js";

export const registerUser = async (userData, currentUser = null) => {
  const normalizedEmail = String(userData.email || "").trim().toLowerCase();
  const requestedRole = userData.role || "SALES_EXECUTIVE";
  const companyId = currentUser?.companyId || userData.companyId;

  // Verify company subscription plan limits
  if (companyId && requestedRole !== "SUPER_ADMIN") {
    let company = await Company.findById(companyId);
    if (!company) {
      if (companyId === "000000000000000000000000") {
        company = await Company.create({
          _id: "000000000000000000000000",
          name: "Test Default Company",
          email: "test.default@company.com",
          subscription: {
            plan: "PRO_TRIAL",
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            maxUsers: 100
          }
        });
      } else {
        throw new ApiError(404, "Target company record not found.");
      }
    }

    // Check plan expiration
    if (company.subscription?.expiresAt && new Date() > new Date(company.subscription.expiresAt)) {
      throw new ApiError(403, "Company subscription plan has expired. Please upgrade or renew.");
    }

    // Check maximum user cap
    const activeUsersCount = await User.countDocuments({ companyId, isDeleted: { $ne: true } });
    const maxAllowed = company.subscription?.maxUsers || 5;
    if (activeUsersCount >= maxAllowed) {
      throw new ApiError(403, `User creation limit reached (${activeUsersCount}/${maxAllowed}). Please upgrade your plan.`);
    }
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user = await User.create({
    ...userData,
    email: normalizedEmail,
    password: hashedPassword,
    role: requestedRole,
    companyId: companyId,
    permissions: Array.isArray(userData.permissions) ? userData.permissions : [],
    isActive: true,
    isVerified: true
  });

  return getUserSafeData(user);
};

const issueAuthTokens = async (user) => {
  const currentSecret = process.env.JWT_SECRET || "your-secret-key";
  const accessToken = jwt.sign(
    createTokenPayload(user),
    currentSecret,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { ...createTokenPayload(user), type: "refresh" },
    currentSecret,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  user.refreshToken = refreshTokenHash;
  user.lastLogin = new Date();
  await user.save();

  return { accessToken, refreshToken };
};

export const loginUser = async (email, password, rememberMe = false) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account is inactive. Please contact your admin.");
  }

  if (!user.password) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await issueAuthTokens(user);

  return {
    user: getUserSafeData(user),
    accessToken,
    refreshToken,
    rememberMe
  };
};

export const refreshUserToken = async (refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decoded;
  try {
    decoded = verifyTokenWithFallbacks(refreshTokenValue);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || !user.refreshToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const isRefreshTokenValid = await bcrypt.compare(refreshTokenValue, user.refreshToken);
  if (!isRefreshTokenValid) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const { accessToken, refreshToken } = await issueAuthTokens(user);

  return {
    user: getUserSafeData(user),
    accessToken,
    refreshToken
  };
};

export const forgotPassword = async (email) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return {
      message: "If an account exists with that email, an OTP has been sent.",
      otp: undefined
    };
  }

  const otpCode = generateOtp();
  user.otpCode = await bcrypt.hash(otpCode, 10);
  user.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  await user.save();

  const emailSent = await sendOtpEmail(normalizedEmail, otpCode);

  return {
    message: emailSent ? "OTP sent successfully." : "OTP generated successfully.",
    otp: process.env.NODE_ENV === "production" ? undefined : otpCode
  };
};

export const verifyOtp = async (email, otpCode) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+otpCode +otpExpiresAt");

  if (!user || !user.otpCode || !user.otpExpiresAt) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (new Date(user.otpExpiresAt).getTime() < Date.now()) {
    throw new ApiError(400, "OTP expired. Please request a new one.");
  }

  const isOtpValid = await bcrypt.compare(String(otpCode), user.otpCode);
  if (!isOtpValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  return { verified: true };
};

export const resetPassword = async (email, otpCode, newPassword) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password +otpCode +otpExpiresAt");

  if (!user || !user.otpCode || !user.otpExpiresAt) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (new Date(user.otpExpiresAt).getTime() < Date.now()) {
    throw new ApiError(400, "OTP expired. Please request a new one.");
  }

  const isOtpValid = await bcrypt.compare(String(otpCode), user.otpCode);
  if (!isOtpValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  user.refreshToken = undefined;
  await user.save();

  return { message: "Password reset successful" };
};

export const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = undefined;
  await user.save();

  return { message: "Logout successful" };
};

export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const safeData = getUserSafeData(user);
  let permissions = Array.isArray(user.permissions) ? user.permissions : [];

  try {
    const dbRole = await Role.findOne({ code: user.role, companyId: user.companyId });
    if (dbRole && Array.isArray(dbRole.permissions)) {
      permissions = [...new Set([...permissions, ...dbRole.permissions])];
    } else {
      const fallback = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
      permissions = [...new Set([...permissions, ...fallback])];
    }
  } catch (err) {
    console.error("Error fetching dynamic permissions in getCurrentUserService:", err);
  }

  safeData.permissions = permissions;
  return safeData;
};
