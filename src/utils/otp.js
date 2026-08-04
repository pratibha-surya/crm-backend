import OTP from "../models/OTP.model.js";

/**
 * Generate a 6-digit numeric OTP
 */
export const generate6DigitOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Save generated OTP to database (Valid for 10 minutes)
 */
export const saveOTP = async (email, purpose = "REGISTRATION") => {
  const otp = generate6DigitOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

  // Remove any previous active OTPs for this email & purpose
  await OTP.deleteMany({ email, purpose });

  await OTP.create({
    email,
    otp,
    purpose,
    expiresAt
  });

  return otp;
};

/**
 * Verify provided OTP against database records
 */
export const verifyOTP = async (email, otp, purpose = "REGISTRATION") => {
  const record = await OTP.findOne({ email, purpose });

  if (!record) {
    return { valid: false, message: "OTP not found or expired. Please request a new one." };
  }

  if (record.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: record._id });
    return { valid: false, message: "OTP has expired." };
  }

  if (record.otp !== otp) {
    return { valid: false, message: "Invalid OTP code." };
  }

  // Delete OTP record after successful verification
  await OTP.deleteOne({ _id: record._id });
  return { valid: true, message: "OTP verified successfully." };
};
