import Role from "../models/Role.model.js";
import ApiError from "../utils/ApiError.js";

export const getRolesService = async (companyId) => {
  const filter = companyId ? { $or: [{ companyId }, { isSystemDefault: true }] } : {};
  const roles = await Role.find(filter).sort({ createdAt: -1 });

  if (roles.length > 0) return roles;

  // Static fallback array for the 6 core system roles
  return [
    { code: "SUPER_ADMIN", name: "Super Admin", description: "Full system administration access" },
    { code: "COMPANY_ADMIN", name: "Company Admin", description: "Organization and employee management access" },
    { code: "SALES_MANAGER", name: "Sales Manager", description: "Leads, deals, and team monitoring access" },
    { code: "SALES_EXECUTIVE", name: "Sales Executive", description: "Assigned leads and meetings access" },
    { code: "CUSTOMER_SUPPORT", name: "Customer Support", description: "Customer ticket management access" },
    { code: "ACCOUNTANT", name: "Accountant", description: "Invoices, payments, and financial reports access" }
  ];
};

export const createRoleService = async (roleData) => {
  const existing = await Role.findOne({ code: roleData.code.toUpperCase(), companyId: roleData.companyId });
  if (existing) {
    throw new ApiError(400, "Role with this code already exists for this company");
  }
  return await Role.create(roleData);
};

export const updateRoleService = async (roleId, updateData) => {
  const role = await Role.findByIdAndUpdate(roleId, updateData, { new: true, runValidators: true });
  if (!role) {
    throw new ApiError(404, "Role not found");
  }
  return role;
};

export const deleteRoleService = async (roleId) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new ApiError(404, "Role not found");
  }
  if (role.isSystemDefault) {
    throw new ApiError(400, "System default roles cannot be deleted");
  }
  await role.deleteOne();
  return true;
};
