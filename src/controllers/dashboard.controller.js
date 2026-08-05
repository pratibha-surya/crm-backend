import { getDashboardStatsService } from "../services/dashboard.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStatsService(req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, stats, "Dashboard overview metrics loaded successfully"));
});
