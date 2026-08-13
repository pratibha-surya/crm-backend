import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getCategoriesService, createCategoryService, deleteCategoryService } from "../services/category.service.js";

export const getCategories = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId;
  const categories = await getCategoriesService(companyId);
  res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export const createCategory = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId;
  const category = await createCategoryService({ ...req.body, companyId });
  res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId;
  await deleteCategoryService(req.params.id, companyId);
  res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
});
