import Meeting from "../models/Meeting.model.js";
import ApiError from "../utils/ApiError.js";
import { createGoogleMeetEvent } from "./googleMeet.service.js";

export const getMeetingsService = async (query = {}, companyId) => {
  const { page = 1, limit = 10, search = "", status, meetingPlatform } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (companyId) filter.companyId = companyId;
  if (status) filter.status = status;
  if (meetingPlatform) filter.meetingPlatform = meetingPlatform;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { agenda: { $regex: search, $options: "i" } }
    ];
  }

  const [meetings, total] = await Promise.all([
    Meeting.find(filter)
      .populate("organizer", "firstName lastName email")
      .sort({ scheduledAt: 1 })
      .skip(skip)
      .limit(limitNum),
    Meeting.countDocuments(filter)
  ]);

  return {
    meetings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

export const createMeetingService = async (data) => {
  if (data.meetingPlatform === "GOOGLE_MEET" && !data.meetingLink) {
    const googleMeetLink = await createGoogleMeetEvent({ ...data, organizerId: data.organizer });
    if (googleMeetLink) {
      data.meetingLink = googleMeetLink;
    } else {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const p1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * 26)]).join("");
    const p2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 26)]).join("");
    const p3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * 26)]).join("");
    data.meetingLink = `https://meet.google.com/${p1}-${p2}-${p3}`;
    }
  } else if (data.meetingPlatform === "ZOOM" && !data.meetingLink) {
    data.meetingLink = `https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`;
  }
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
