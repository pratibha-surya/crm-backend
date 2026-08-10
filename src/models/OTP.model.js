import mongoose from "mongoose";

const { Schema, model } = mongoose;

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    otp: {
      type: Number,
      required: true
    },
    purpose: {
      type: String,
      enum: ["REGISTRATION", "FORGOT_PASSWORD", "2FA"],
      default: "REGISTRATION"
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// Auto-delete expired OTP records
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model("OTP", otpSchema);
