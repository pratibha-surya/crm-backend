import { saveOTP, verifyOTP } from "../utils/otp.js";
import ApiError from "../utils/ApiError.js";

/**
 * Send OTP via Email (or simulated fallback)
 */
export const sendOTPEmail = async (email, purpose = "REGISTRATION") => {
  if (!email) {
    throw new ApiError(400, "Email address is required to send OTP.");
  }

  const otp = await saveOTP(email, purpose);

  console.log(`\n=================================================`);
  console.log(`🔑 [OTP SERVICE] Email: ${email} | Purpose: ${purpose}`);
  console.log(`👉 Generated OTP Code: ${otp}`);
  console.log(`=================================================\n`);

  return {
    success: true,
    message: `OTP sent successfully to ${email}. (Check server console for local testing)`,
    otp: Number(otp)
  };
};

import User from "../models/User.model.js";

/**
 * Verify OTP entered by user and activate account
 */
export const verifyOTPService = async (email, otp, purpose = "REGISTRATION") => {
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP code are required.");
  }

  const result = await verifyOTP(email, otp, purpose);

  if (!result.valid) {
    throw new ApiError(400, result.message);
  }

  // Activate & verify user account in DB
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { isActive: true, isVerified: true },
    { new: true }
  );

  return {
    success: true,
    message: user
      ? "OTP verified successfully. Your account is now active!"
      : "OTP verified successfully.",
    user: user ? { email: user.email, role: user.role, isActive: user.isActive, isVerified: user.isVerified } : undefined
  };
};
