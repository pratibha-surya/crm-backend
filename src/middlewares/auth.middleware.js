import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Role from "../models/Role.model.js";
import { DEFAULT_ROLE_PERMISSIONS } from "./permission.middleware.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured");
  }

  return process.env.JWT_SECRET;
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
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
    console.log("token")
    throw new ApiError(401, "Not authorized to access this route");
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token. Please login again.");
  }

  let permissions = [];
  try {
    // Look up dynamic role config from DB
    let dbRole = null;
    if (decoded.companyId) {
      dbRole = await Role.findOne({ code: decoded.role, companyId: decoded.companyId });
    }
    if (!dbRole) {
      dbRole = await Role.findOne({ code: decoded.role });
    }
    if (dbRole && Array.isArray(dbRole.permissions)) {
      permissions = dbRole.permissions;
    } else {
      permissions = DEFAULT_ROLE_PERMISSIONS[decoded.role] || [];
    }
  } catch (err) {
    console.error("Error fetching dynamic permissions in protect middleware:", err);
    permissions = DEFAULT_ROLE_PERMISSIONS[decoded.role] || [];
  }

  req.user = {
    _id: decoded.id,
    id: decoded.id,
    role: decoded.role,
    email: decoded.email,
    companyId: decoded.companyId,
    permissions
  };
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
      const decoded = verifyToken(token);

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
