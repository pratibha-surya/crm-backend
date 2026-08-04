import Settings from "../models/Settings.model.js";
import ApiError from "../utils/ApiError.js";

export const getSettingsService = async (companyId) => {
  if (!companyId) {
    throw new ApiError(400, "Company ID is required");
  }

  const settings = await Settings.findOne({ companyId }).lean();
  if (!settings) {
    return await Settings.create({ companyId });
  }

  return settings;
};

export const updateSettingsService = async (companyId, updateData) => {
  if (!companyId) {
    throw new ApiError(400, "Company ID is required");
  }

  const settings = await Settings.findOneAndUpdate(
    { companyId },
    updateData,
    { new: true, upsert: true, runValidators: true }
  );

  return settings;
};
