import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    password: { type: String, required: true, select: false },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", index: true },
    permissions: [{ type: String }],
    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "SALES_MANAGER",
        "SALES_EXECUTIVE",
        "CUSTOMER_SUPPORT",
        "ACCOUNTANT"
      ],
      default: "SALES_EXECUTIVE"
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    lastLogin: Date,
    refreshToken: { type: String, select: false },
    otpCode: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false }
  },
  { timestamps: true }
);

export default model("User", userSchema);
