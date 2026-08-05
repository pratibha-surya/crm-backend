import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

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

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    /^bearer\s/i.test(req.headers.authorization)
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Not authorized to access this route");
  }

  let decoded;
  try {
    decoded = verifyTokenWithFallbacks(token);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token. Please login again.");
  }

  const currentUser = await User.findById(decoded.id).select("-password");

  if (!currentUser || !currentUser.isActive || currentUser.isDeleted) {
    throw new ApiError(
      401,
      "The user belonging to this token no longer exists or is inactive."
    );
  }

  req.user = currentUser;
  next();
});

export const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    /^bearer\s/i.test(req.headers.authorization)
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = verifyTokenWithFallbacks(token);

      const currentUser = await User.findById(decoded.id).select("-password");
      if (currentUser && currentUser.isActive) {
        req.user = currentUser;
      }
    } catch (error) {
      // Ignore token error for optional auth
    }
  }

  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }
    next();
  };
};
