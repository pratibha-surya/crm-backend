import ApiError from "../utils/ApiError.js";

/**
 * Role-Based Access Control Middleware (RBAC)
 * Usage Example: authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER")
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access Denied: Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};

export default authorizeRoles;
