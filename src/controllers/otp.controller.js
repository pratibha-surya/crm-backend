import { sendOTPEmail, verifyOTPService } from "../services/otp.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const handleSendOTP = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;
  const result = await sendOTPEmail(email, purpose);
  return res.status(200).json(new ApiResponse(200, result, "OTP sent successfully"));
});

export const handleVerifyOTP = asyncHandler(async (req, res) => {
  const { email, otp, purpose } = req.body;
  const result = await verifyOTPService(email, otp, purpose);
  return res.status(200).json(new ApiResponse(200, result, "OTP verified successfully"));
});
