import { getMeetingsService, createMeetingService } from "../services/meeting.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getMeetings = asyncHandler(async (req, res) => {
  const meetings = await getMeetingsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, meetings, "Meetings fetched successfully"));
});

export const createMeeting = asyncHandler(async (req, res) => {
  const meeting = await createMeetingService({ ...req.body, companyId: req.user?.companyId, organizer: req.user?._id });
  res.status(201).json(new ApiResponse(201, meeting, "Meeting scheduled successfully"));
});
