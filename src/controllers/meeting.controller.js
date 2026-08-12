import { 
  getMeetingsService, 
  createMeetingService, 
  getMeetingByIdService, 
  updateMeetingService, 
  deleteMeetingService 
} from "../services/meeting.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getMeetings = asyncHandler(async (req, res) => {
  const meetings = await getMeetingsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, meetings, "Meetings fetched successfully"));
});

export const createMeeting = asyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user?.companyId || "000000000000000000000000";
  const organizer = req.user?._id;
  const meeting = await createMeetingService({ ...req.body, companyId, organizer });
  res.status(201).json(new ApiResponse(201, meeting, "Meeting scheduled successfully"));
});

export const getMeetingById = asyncHandler(async (req, res) => {
  const meeting = await getMeetingByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, meeting, "Meeting details fetched successfully"));
});

export const updateMeeting = asyncHandler(async (req, res) => {
  const meeting = await updateMeetingService(req.params.id, req.body, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, meeting, "Meeting updated successfully"));
});

export const deleteMeeting = asyncHandler(async (req, res) => {
  await deleteMeetingService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Meeting deleted successfully"));
});
