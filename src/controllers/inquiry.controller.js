import Inquiry from "../models/Inquiry.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// @desc    Get all inquiries
// @route   GET /api/v1/inquiries
export const getInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, inquiries, "Inquiries fetched successfully"));
});

// @desc    Get inquiry by ID
// @route   GET /api/v1/inquiries/:id
export const getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }
  return res.status(200).json(new ApiResponse(200, inquiry, "Inquiry details fetched successfully"));
});

// @desc    Create a new inquiry / Start chat
// @route   POST /api/v1/inquiries
export const createInquiry = asyncHandler(async (req, res) => {
  const { name, mobile, email, message } = req.body;

  if (!name || !mobile || !email) {
    throw new ApiError(400, "Name, mobile, and email are required");
  }

  // Generate a simple 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  const initialMessages = [];
  if (message) {
    initialMessages.push({
      role: "user",
      text: message,
      createdAt: new Date(),
    });
  }

  const inquiry = await Inquiry.create({
    name,
    mobile,
    email,
    otp,
    otpExpiresAt,
    isVerified: false,
    messages: initialMessages,
  });

  // Log the generated OTP for demo/testing convenience
  console.log(`🔑 Generated OTP for ${name} (${mobile}): ${otp}`);

  return res.status(201).json(new ApiResponse(210, inquiry, "Inquiry initiated. OTP generated successfully"));
});

// @desc    Verify OTP
// @route   POST /api/v1/inquiries/:id/verify
export const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  if (inquiry.isVerified) {
    return res.status(200).json(new ApiResponse(200, inquiry, "Inquiry is already verified"));
  }

  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  if (inquiry.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (new Date() > inquiry.otpExpiresAt) {
    throw new ApiError(400, "OTP has expired");
  }

  inquiry.isVerified = true;
  inquiry.otp = undefined;
  inquiry.otpExpiresAt = undefined;
  await inquiry.save();

  return res.status(200).json(new ApiResponse(200, inquiry, "OTP verified successfully"));
});

// @desc    Add message to inquiry chat
// @route   POST /api/v1/inquiries/:id/messages
export const addMessage = asyncHandler(async (req, res) => {
  const { role, text } = req.body;

  if (!role || !text) {
    throw new ApiError(400, "Role and text are required");
  }

  if (!["user", "model"].includes(role)) {
    throw new ApiError(400, "Role must be either 'user' or 'model'");
  }

  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  inquiry.messages.push({
    role,
    text,
    createdAt: new Date(),
  });

  await inquiry.save();

  return res.status(200).json(new ApiResponse(200, inquiry, "Message added successfully"));
});

// @desc    Delete an inquiry
// @route   DELETE /api/v1/inquiries/:id
export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }
  return res.status(200).json(new ApiResponse(200, null, "Inquiry deleted successfully"));
});
