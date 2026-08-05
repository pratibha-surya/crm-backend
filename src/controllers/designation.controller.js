import { 
  getDesignationsService, 
  getDesignationByIdService, 
  createDesignationService, 
  updateDesignationService, 
  deleteDesignationService 
} from "../services/designation.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const getDesignations = asyncHandler(async (req, res) => {
  const designations = await getDesignationsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, designations, "Designations fetched successfully"));
});

export const getDesignationById = asyncHandler(async (req, res) => {
  const designation = await getDesignationByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, designation, "Designation details fetched successfully"));
});

export const createDesignation = asyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user?.companyId || "000000000000000000000000";
  const designation = await createDesignationService({ ...req.body, companyId });
  res.status(201).json(new ApiResponse(201, designation, "Designation created successfully"));
});

export const updateDesignation = asyncHandler(async (req, res) => {
  const designation = await updateDesignationService(req.params.id, req.body, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, designation, "Designation updated successfully"));
});

export const deleteDesignation = asyncHandler(async (req, res) => {
  await deleteDesignationService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Designation deleted successfully"));
});
