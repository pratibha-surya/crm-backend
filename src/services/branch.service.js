import Branch from "../models/Branch.model.js";
import ApiError from "../utils/ApiError.js";

export const getBranchesService = async (query = {}, companyId) => {
  const { page = 1, limit = 10, search = "" } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (companyId) filter.companyId = companyId;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } }
    ];
  }

  const [branches, total] = await Promise.all([
    Branch.find(filter).sort({ name: 1 }).skip(skip).limit(limitNum),
    Branch.countDocuments(filter)
  ]);

  return {
    branches,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

export const getBranchByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const branch = await Branch.findOne(filter);
  if (!branch) throw new ApiError(404, "Branch not found");
  return branch;
};

export const createBranchService = async (data) => {
  const existingBranch = await Branch.findOne({ companyId: data.companyId, code: data.code });
  if (existingBranch) {
    throw new ApiError(409, "Branch with this code already exists in your company");
  }
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
