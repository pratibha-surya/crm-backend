import { 
  getDepartmentsService, 
  getDepartmentByIdService, 
  createDepartmentService, 
  updateDepartmentService, 
  deleteDepartmentService 
} from "../services/department.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await getDepartmentsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, departments, "Departments fetched successfully"));
});

export const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await getDepartmentByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, department, "Department details fetched successfully"));
});

export const createDepartment = asyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user?.companyId || "000000000000000000000000";
  const department = await createDepartmentService({ ...req.body, companyId });
  res.status(201).json(new ApiResponse(201, department, "Department created successfully"));
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const department = await updateDepartmentService(req.params.id, req.body, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, department, "Department updated successfully"));
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  await deleteDepartmentService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Department deleted successfully"));
});
