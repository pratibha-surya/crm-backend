import { 
  getAttendanceService, 
  getAttendanceByIdService, 
  recordAttendanceService, 
  updateAttendanceService, 
  deleteAttendanceService 
} from "../services/attendance.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAttendance = asyncHandler(async (req, res) => {
  const attendanceRecords = await getAttendanceService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, attendanceRecords, "Attendance records fetched successfully"));
});

export const getAttendanceById = asyncHandler(async (req, res) => {
  const record = await getAttendanceByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, record, "Attendance details fetched successfully"));
});

export const recordAttendance = asyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user?.companyId || "000000000000000000000000";
  const record = await recordAttendanceService({ ...req.body, companyId });
  res.status(200).json(new ApiResponse(200, record, "Attendance recorded successfully"));
});

export const updateAttendance = asyncHandler(async (req, res) => {
  const record = await updateAttendanceService(req.params.id, req.body, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, record, "Attendance updated successfully"));
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  await deleteAttendanceService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Attendance record deleted successfully"));
});
