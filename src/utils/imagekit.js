import ImageKit from "imagekit";
import Settings from "../models/Settings.model.js";
import ApiError from "./ApiError.js";

export const uploadToImageKit = async (companyId, fileBuffer, fileName) => {
  if (!companyId) {
    throw new ApiError(400, "Company ID is required to fetch ImageKit credentials.");
  }

  const settings = await Settings.findOne({ companyId });

  if (!settings || !settings.apiKeys || !settings.apiKeys.imageKitPublicKey || !settings.apiKeys.imageKitPrivateKey || !settings.apiKeys.imageKitUrlEndpoint) {
    throw new ApiError(400, "ImageKit API keys are not configured for this company. Please update your Settings > SMTP & API tab.");
  }

  const imagekit = new ImageKit({
    publicKey: settings.apiKeys.imageKitPublicKey,
    privateKey: settings.apiKeys.imageKitPrivateKey,
    urlEndpoint: settings.apiKeys.imageKitUrlEndpoint,
  });

  return new Promise((resolve, reject) => {
    imagekit.upload({
      file: fileBuffer.toString("base64"),
      fileName: fileName,
      folder: `/crm/companies/${companyId}/logos/`,
    }, (error, result) => {
      if (error) {
        reject(new ApiError(500, "Failed to upload image to ImageKit: " + (error.message || error)));
      } else {
        resolve(result.url);
      }
    });
  });
};
