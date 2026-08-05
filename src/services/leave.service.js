import Leave from "../models/Leave.model.js";
import ApiError from "../utils/ApiError.js";

export const getLeavesService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Leave.find(filter)
    .populate("userId", "firstName lastName email employeeCode")
    .sort({ startDate: -1 });
};

export const getLeaveByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const leave = await Leave.findOne(filter).populate("userId", "firstName lastName email employeeCode");
  if (!leave) throw new ApiError(404, "Leave request not found");
  return leave;
};

export const createLeaveService = async (data) => {
  return await Leave.create(data);
};

export const updateLeaveStatusService = async (id, status, approvedBy, notes = "", companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const leave = await Leave.findOneAndUpdate(
    filter,
    { status, approvedBy, notes },
    { new: true, runValidators: true }
  );
  if (!leave) throw new ApiError(404, "Leave request not found");
  return leave;
};

export const deleteLeaveService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const leave = await Leave.findOneAndDelete(filter);
  if (!leave) throw new ApiError(404, "Leave request not found");
  return leave;
};
