import Department from "../models/Department.model.js";
import ApiError from "../utils/ApiError.js";

export const getDepartmentsService = async (query = {}, companyId) => {
  const { page = 1, limit = 10, search = "", branchId } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (companyId) filter.companyId = companyId;
  if (branchId) filter.branchId = branchId;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } }
    ];
  }

  const [departments, total] = await Promise.all([
    Department.find(filter)
      .populate("branchId", "name code")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum),
    Department.countDocuments(filter)
  ]);

  return {
    departments,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

export const getDepartmentByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const department = await Department.findOne(filter).populate("branchId", "name code");
  if (!department) throw new ApiError(404, "Department not found");
  return department;
};

export const createDepartmentService = async (data) => {
  const existingDept = await Department.findOne({ companyId: data.companyId, code: data.code });
  if (existingDept) {
    throw new ApiError(409, "Department with this code already exists in your company");
  }
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
