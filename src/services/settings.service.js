import Settings from "../models/Settings.model.js";
import ApiError from "../utils/ApiError.js";

export const getSettingsService = async (companyId) => {
  if (!companyId) {
    throw new ApiError(400, "Company ID is required");
  }

  let settings = await Settings.findOne({ companyId });

  if (!settings) {
    settings = await Settings.create({
      companyId,
      company: {
        name: "",
        logo: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        gstNumber: "",
      },
      currency: "INR",
      timezone: "Asia/Kolkata",
      language: "en",
      theme: "light",
      smtp: {
        host: "",
        port: 587,
        secure: false,
        user: "",
        pass: "",
        fromEmail: "",
        fromName: "",
      },
      apiKeys: {
        imageKitPublicKey: "",
        imageKitPrivateKey: "",
        imageKitUrlEndpoint: "",
        razorpayKeyId: "",
        razorpayKeySecret: "",
        stripePublishableKey: "",
        stripeSecretKey: "",
        openAiApiKey: "",
      },
      invoice: {
        prefix: "INV-",
        startingNumber: 1001,
        terms: "",
        notes: "",
      },
    });
  }

  return settings;
};

export const updateSettingsService = async (companyId, updateData) => {
  if (!companyId) {
    throw new ApiError(400, "Company ID is required");
  }

  return await Settings.findOneAndUpdate(
    { companyId },
    { $set: updateData },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};