import { 
  getFollowupsService, 
  createFollowupService, 
  updateFollowupStatusService, 
  deleteFollowupService 
} from "../services/followup.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getFollowups = asyncHandler(async (req, res) => {
  const followups = await getFollowupsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, followups, "Follow-ups fetched successfully"));
});

export const createFollowup = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId || req.body.companyId;
  const followup = await createFollowupService({ ...req.body, companyId });
  res.status(201).json(new ApiResponse(201, followup, "Follow-up task scheduled successfully"));
});

export const updateFollowupStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const followup = await updateFollowupStatusService(req.params.id, status, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, followup, `Follow-up status updated to '${status}'`));
});

export const deleteFollowup = asyncHandler(async (req, res) => {
  await deleteFollowupService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Follow-up task deleted successfully"));
});
