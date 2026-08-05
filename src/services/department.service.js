import Department from "../models/Department.model.js";
import ApiError from "../utils/ApiError.js";

export const getDepartmentsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Department.find(filter).populate("branchId", "name code").sort({ name: 1 });
};

export const getDepartmentByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const department = await Department.findOne(filter).populate("branchId", "name code");
  if (!department) throw new ApiError(404, "Department not found");
  return department;
};

export const createDepartmentService = async (data) => {
  return await Department.create(data);
};

export const updateDepartmentService = async (id, updateData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const department = await Department.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
  if (!department) throw new ApiError(404, "Department not found");
  return department;
};

export const deleteDepartmentService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const department = await Department.findOneAndDelete(filter);
  if (!department) throw new ApiError(404, "Department not found");
  return department;
};
