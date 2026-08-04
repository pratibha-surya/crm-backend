import {
  getReportsOverviewService,
  getSalesReportService
} from "../services/report.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getReportsOverview = asyncHandler(async (req, res) => {
  const report = await getReportsOverviewService(req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, report, "Reports overview fetched successfully"));
});

export const getSalesReport = asyncHandler(async (req, res) => {
  const report = await getSalesReportService(req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, report, "Sales report fetched successfully"));
});
