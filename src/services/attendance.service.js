import Attendance from "../models/Attendance.model.js";
import ApiError from "../utils/ApiError.js";

export const getAttendanceService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Attendance.find(filter)
    .populate("userId", "firstName lastName email employeeCode")
    .sort({ date: -1 });
};

export const getAttendanceByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const record = await Attendance.findOne(filter).populate("userId", "firstName lastName email employeeCode");
  if (!record) throw new ApiError(404, "Attendance record not found");
  return record;
};

export const recordAttendanceService = async (data) => {
  const { userId, date } = data;
  
  // Normalize date to start of the day for compound unique check
  const dateObj = new Date(date);
  dateObj.setUTCHours(0, 0, 0, 0);
  data.date = dateObj;

  // Upsert pattern: if user already has an attendance record for the day, update checkIn/checkOut/status
  return await Attendance.findOneAndUpdate(
    { userId, date: dateObj },
    data,
    { new: true, upsert: true, runValidators: true }
  );
};

export const updateAttendanceService = async (id, updateData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const record = await Attendance.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
  if (!record) throw new ApiError(404, "Attendance record not found");
  return record;
};

export const deleteAttendanceService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const record = await Attendance.findOneAndDelete(filter);
  if (!record) throw new ApiError(404, "Attendance record not found");
  return record;
};
