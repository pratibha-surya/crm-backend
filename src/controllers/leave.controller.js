import { 
  getLeavesService, 
  getLeaveByIdService, 
  createLeaveService, 
  updateLeaveStatusService, 
  deleteLeaveService 
} from "../services/leave.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getLeaves = asyncHandler(async (req, res) => {
  const leaves = await getLeavesService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, leaves, "Leave requests fetched successfully"));
});

export const getLeaveById = asyncHandler(async (req, res) => {
  const leave = await getLeaveByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, leave, "Leave request details fetched successfully"));
});

export const createLeave = asyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user?.companyId || "000000000000000000000000";
  const userId = req.body.userId || req.user?._id;
  
  if (!userId) {
    res.status(400).json({ success: false, message: "User ID is required" });
    return;
  }
  
  const leave = await createLeaveService({ ...req.body, companyId, userId });
  res.status(201).json(new ApiResponse(201, leave, "Leave request submitted successfully"));
});

export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const approvedBy = req.user?._id || "000000000000000000000000";
  const leave = await updateLeaveStatusService(req.params.id, status, approvedBy, notes, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, leave, `Leave status updated to '${status}'`));
});

export const deleteLeave = asyncHandler(async (req, res) => {
  await deleteLeaveService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Leave request deleted successfully"));
});
