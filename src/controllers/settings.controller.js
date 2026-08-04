import { getSettingsService, updateSettingsService } from "../services/settings.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getSettingsService(req.query.companyId || req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, settings, "Settings fetched successfully"));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await updateSettingsService(req.query.companyId || req.user?.companyId, req.body);
  return res.status(200).json(new ApiResponse(200, settings, "Settings updated successfully"));
});
