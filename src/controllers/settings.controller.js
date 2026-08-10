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

export const uploadLogo = asyncHandler(async (req, res) => {
  const companyId = req.query.companyId || req.user?.companyId || "000000000000000000000000";
  
  if (!req.file) {
    throw new ApiError(400, "No image file provided.");
  }
  
  const { uploadToImageKit } = await import("../utils/imagekit.js");
  const logoUrl = await uploadToImageKit(companyId, req.file.buffer, req.file.originalname);
  
  // Update the logo in the database
  const updatedSettings = await updateSettingsService(companyId, { company: { logo: logoUrl } });
  
  return res.status(200).json(new ApiResponse(200, { logoUrl, settings: updatedSettings }, "Logo uploaded successfully"));
});
