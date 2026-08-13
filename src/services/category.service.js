import Category from "../models/Category.model.js";
import ApiError from "../utils/ApiError.js";

export const getCategoriesService = async (companyId) => {
  return await Category.find({ companyId }).sort({ name: 1 });
};

export const createCategoryService = async (data) => {
  const existing = await Category.findOne({ companyId: data.companyId, name: data.name });
  if (existing) {
    throw new ApiError(409, "Category with this name already exists");
  }
  return await Category.create(data);
};

export const deleteCategoryService = async (id, companyId) => {
  const category = await Category.findOneAndDelete({ _id: id, companyId });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return category;
};
