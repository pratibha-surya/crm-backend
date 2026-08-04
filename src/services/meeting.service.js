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
