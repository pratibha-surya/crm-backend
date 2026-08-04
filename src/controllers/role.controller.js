import {
  getRolesService,
  createRoleService,
  updateRoleService,
  deleteRoleService
} from "../services/role.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getRoles = asyncHandler(async (req, res) => {
  const roles = await getRolesService(req.user?.companyId);
  return res
    .status(200)
    .json(new ApiResponse(200, roles, "Roles retrieved successfully"));
});

export const createRole = asyncHandler(async (req, res) => {
  const role = await createRoleService({
    ...req.body,
    companyId: req.user?.companyId || req.body.companyId
  });
  return res
    .status(201)
    .json(new ApiResponse(201, role, "Role created successfully"));
});

export const updateRole = asyncHandler(async (req, res) => {
  const updatedRole = await updateRoleService(req.params.id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedRole, "Role updated successfully"));
});

export const deleteRole = asyncHandler(async (req, res) => {
  await deleteRoleService(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Role deleted successfully"));
});
