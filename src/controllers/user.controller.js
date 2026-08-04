import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService
} from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService(req.query, req.user?.companyId);
  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users retrieved successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details retrieved successfully"));
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserService({
    ...req.body,
    companyId: req.user?.companyId || req.body.companyId
  });
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User created successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserService(req.params.id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await deleteUserService(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});
