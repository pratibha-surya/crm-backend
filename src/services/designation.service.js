import Designation from "../models/Designation.model.js";
import ApiError from "../utils/ApiError.js";

export const getDesignationsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Designation.find(filter).sort({ name: 1 });
};

export const getDesignationByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const designation = await Designation.findOne(filter);
  if (!designation) throw new ApiError(404, "Designation not found");
  return designation;
};

export const createDesignationService = async (data) => {
  return await Designation.create(data);
};

export const updateDesignationService = async (id, updateData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const designation = await Designation.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
  if (!designation) throw new ApiError(404, "Designation not found");
  return designation;
};

export const deleteDesignationService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const designation = await Designation.findOneAndDelete(filter);
  if (!designation) throw new ApiError(404, "Designation not found");
  return designation;
};
