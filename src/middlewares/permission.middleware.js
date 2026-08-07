import ApiError from "../utils/ApiError.js";
import Role from "../models/Role.model.js";

export const DEFAULT_ROLE_PERMISSIONS = {
  SALES_MANAGER: [
    "customers:read",
    "customers:create",
    "customers:update",
    "leads:read",
    "leads:create",
    "leads:update",
    "deals:read",
    "deals:create",
    "deals:update",
    "quotations:read",
    "quotations:create",
    "quotations:update",
    "tasks:read",
    "tasks:create",
    "tasks:update"
  ],
  SALES_EXECUTIVE: [
    "customers:read",
    "leads:read",
    "leads:create",
    "leads:update",
    "deals:read",
    "quotations:read",
    "tasks:read",
    "tasks:create"
  ],
  CUSTOMER_SUPPORT: [
    "customers:read",
    "tickets:create",
    "tickets:read",
    "tickets:resolve",
    "tasks:read",
    "leads:read"
  ],
  ACCOUNTANT: [
    "invoices:read",
    "invoices:create",
    "invoices:update",
    "quotations:read",
    "customers:read"
  ]
};

/**
 * Middleware to check granular permissions for a given module and action.
 * Example usage: checkPermission("customers", "create")
 */
export const checkPermission = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new ApiError(401, "User not authenticated"));
      }

      const requiredPermission = `${moduleName}:${action}`;

      if (req.user.role === "SUPER_ADMIN" || req.user.role === "COMPANY_ADMIN") {
        return next();
      }

      const userPermissions = Array.isArray(req.user.permissions)
        ? req.user.permissions
        : [];

      if (userPermissions.includes(requiredPermission)) {
        return next();
      }

      const fallbackPermissions = DEFAULT_ROLE_PERMISSIONS[req.user.role] || [];
      if (fallbackPermissions.includes(requiredPermission)) {
        return next();
      }

      return next(new ApiError(403, `Permission denied: Cannot ${action} on ${moduleName}`));
    } catch (error) {
      return next(error);
    }
  };
};
