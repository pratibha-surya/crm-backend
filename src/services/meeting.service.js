import Meeting from "../models/Meeting.model.js";
import ApiError from "../utils/ApiError.js";

export const getMeetingsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Meeting.find(filter).populate("organizer", "firstName lastName email").sort({ scheduledAt: 1 });
};

export const createMeetingService = async (data) => {
  return await Meeting.create(data);
};

export const getMeetingByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const meeting = await Meeting.findOne(filter).populate("organizer", "firstName lastName email");
  if (!meeting) throw new ApiError(404, "Meeting not found");
  return meeting;
};

export const updateMeetingService = async (id, updateData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const meeting = await Meeting.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
  if (!meeting) throw new ApiError(404, "Meeting not found");
  return meeting;
};

export const deleteMeetingService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const meeting = await Meeting.findOneAndDelete(filter);
  if (!meeting) throw new ApiError(404, "Meeting not found");
  return meeting;
};
