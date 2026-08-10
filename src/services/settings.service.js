import Settings from "../models/Settings.model.js";
import ApiError from "../utils/ApiError.js";

export const getSettingsService = async (companyId) => {
  const targetCompanyId = companyId || "000000000000000000000000";

  let settings = await Settings.findOne({ companyId: targetCompanyId });

  if (!settings) {
    settings = await Settings.create({
      companyId: targetCompanyId,
      company: {
        name: "Netrootx",
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
      notifications: {
        inApp: true,
        email: true,
        sms: true,
        push: true,
        browser: false,
      },
    });
  }

  return settings;
};

export const updateSettingsService = async (companyId, updateData) => {
  const targetCompanyId = companyId || "000000000000000000000000";

  return await Settings.findOneAndUpdate(
    { companyId: targetCompanyId },
    { $set: updateData },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};