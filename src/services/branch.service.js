import Branch from "../models/Branch.model.js";
import ApiError from "../utils/ApiError.js";

export const getBranchesService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Branch.find(filter).sort({ name: 1 });
};

export const getBranchByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const branch = await Branch.findOne(filter);
  if (!branch) throw new ApiError(404, "Branch not found");
  return branch;
};

export const createBranchService = async (data) => {
  return await Branch.create(data);
};

export const updateBranchService = async (id, updateData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const branch = await Branch.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
  if (!branch) throw new ApiError(404, "Branch not found");
  return branch;
};

export const deleteBranchService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const branch = await Branch.findOneAndDelete(filter);
  if (!branch) throw new ApiError(404, "Branch not found");
  return branch;
};
