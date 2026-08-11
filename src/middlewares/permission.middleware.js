import ApiError from "../utils/ApiError.js";
import Role from "../models/Role.model.js";

export const DEFAULT_ROLE_PERMISSIONS = {
  SALES_MANAGER: [
    "calendar:read",
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
    "tasks:update",
    "employees:read"
  ],
  SALES_EXECUTIVE: [
    "calendar:read",
    "customers:read",
    "leads:read",
    "leads:create",
    "leads:update",
    "deals:read",
    "quotations:read",
    "quotations:create",
    "quotations:update",
    "tasks:read",
    "tasks:create",
    "employees:read",
    "meetings:read",
    "meetings:create",
    "meetings:update"
  ],
  CUSTOMER_SUPPORT: [
    "calendar:read",
    "customers:read",
    "tickets:create",
    "tickets:read",
    "tickets:resolve",
    "tasks:read",
    "leads:read",
    "employees:read"
  ],
  ACCOUNTANT: [
    "calendar:read",
    "invoices:read",
    "invoices:create",
    "invoices:update",
    "quotations:read",
    "customers:read"
  ],
  COMPANY_ADMIN: [
    "dashboard:read",
    "calendar:read",
    "employees:read", "employees:create", "employees:update", "employees:delete", "employees:export",
    "customers:read", "customers:create", "customers:update", "customers:delete", "customers:export",
    "leads:read", "leads:create", "leads:update", "leads:delete", "leads:export",
    "pipeline:read", "pipeline:create", "pipeline:update", "pipeline:delete", "pipeline:export",
    "meetings:read", "meetings:create", "meetings:update", "meetings:delete", "meetings:export",
    "tasks:read", "tasks:create", "tasks:update", "tasks:delete", "tasks:export",
    "quotations:read", "quotations:create", "quotations:update", "quotations:delete", "quotations:export",
    "invoices:read", "invoices:create", "invoices:update", "invoices:delete", "invoices:export",
    "products:read", "products:create", "products:update", "products:delete", "products:export",
    "inventory:read", "inventory:create", "inventory:update", "inventory:delete", "inventory:export",
    "tickets:read", "tickets:create", "tickets:update", "tickets:delete", "tickets:export", "tickets:resolve",
    "reports:read", "reports:export",
    "audit:read", "audit:export",
    "roles:read", "roles:update",
    "settings:read", "settings:update",
    "branches:read", "branches:create", "branches:update", "branches:delete", "branches:export",
    "departments:read", "departments:create", "departments:update", "departments:delete", "departments:export",
    "designations:read", "designations:create", "designations:update", "designations:delete", "designations:export"
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

      if (req.user.role === "SUPER_ADMIN") {
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
