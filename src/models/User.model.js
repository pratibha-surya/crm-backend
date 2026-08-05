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
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", index: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", index: true },
    designationId: { type: Schema.Types.ObjectId, ref: "Designation", index: true },
    employeeCode: { type: String, unique: true, sparse: true, trim: true },
    profileImage: { type: String, default: "" },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],
    joiningDate: { type: Date },
    salary: { type: Number, default: 0 },
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
