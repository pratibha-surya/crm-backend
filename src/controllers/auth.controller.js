import {
  registerUser,
  loginUser,
  refreshUserToken,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logoutUser,
  getCurrentUserService
} from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const setAuthCookies = (res, accessToken, refreshToken, rememberMe = false) => {
  const isProduction = process.env.NODE_ENV === "production";
  const accessMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const refreshMaxAge = rememberMe ? 60 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: accessMaxAge
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: refreshMaxAge
  });
};

export const handleRegister = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body, req.user);
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export const handleLogin = asyncHandler(async (req, res) => {
  const { email, password, rememberMe = false } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  const { user, accessToken, refreshToken } = await loginUser(email, password, rememberMe);

  setAuthCookies(res, accessToken, refreshToken, rememberMe);

  return res
    .status(200)
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});

export const handleRefreshToken = asyncHandler(async (req, res) => {
  const refreshTokenValue = req.body?.refreshToken || req.cookies?.refreshToken;

  if (!refreshTokenValue) {
    throw new ApiError(401, "Refresh token is required");
  }

  const { user, accessToken, refreshToken } = await refreshUserToken(refreshTokenValue);

  setAuthCookies(res, accessToken, refreshToken);

  return res
    .status(200)
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Token refreshed successfully"));
});

export const handleForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Please provide email");
  }

  const payload = await forgotPassword(email);
  return res
    .status(200)
    .json(new ApiResponse(200, payload, "OTP generated successfully"));
});

import { verifyOTPService } from "../services/otp.service.js";

export const handleVerifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, purpose } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, "Please provide email and OTP");
  }

  const payload = await verifyOTPService(email, otp, purpose || "REGISTRATION");
  return res
    .status(200)
    .json(new ApiResponse(200, payload, "OTP verified successfully"));
});

export const handleResetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    throw new ApiError(400, "Please provide email, OTP and password");
  }

  const payload = await resetPassword(email, otp, password);
  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Password reset successful"));
});

export const handleLogout = asyncHandler(async (req, res) => {
  const payload = await logoutUser(req.user._id);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Logout successful"));
});

export const handleGetMe = asyncHandler(async (req, res) => {
  const userProfile = await getCurrentUserService(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, userProfile, "Current user profile fetched"));
});
