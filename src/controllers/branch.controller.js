import { 
  getBranchesService, 
  getBranchByIdService, 
  createBranchService, 
  updateBranchService, 
  deleteBranchService 
} from "../services/branch.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const getBranches = asyncHandler(async (req, res) => {
  const branches = await getBranchesService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, branches, "Branches fetched successfully"));
});

export const getBranchById = asyncHandler(async (req, res) => {
  const branch = await getBranchByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, branch, "Branch details fetched successfully"));
});

export const createBranch = asyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user?.companyId || "000000000000000000000000";
  const branch = await createBranchService({ ...req.body, companyId });
  res.status(201).json(new ApiResponse(201, branch, "Branch registered successfully"));
});

export const updateBranch = asyncHandler(async (req, res) => {
  const branch = await updateBranchService(req.params.id, req.body, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, branch, "Branch updated successfully"));
});

export const deleteBranch = asyncHandler(async (req, res) => {
  await deleteBranchService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Branch deleted successfully"));
});
