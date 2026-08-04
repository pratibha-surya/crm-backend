import mongoose from "mongoose";

const { Schema, model } = mongoose;

const companySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    gstNumber: String,
    panNumber: String,
    logoUrl: String,
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    status: { type: String, enum: ["ACTIVE", "SUSPENDED", "INACTIVE"], default: "ACTIVE" },
    subscription: {
      plan: { type: String, default: "FREE_TRIAL" },
      expiresAt: Date,
      maxUsers: { type: Number, default: 5 }
    }
  },
  { timestamps: true }
);

export default model("Company", companySchema);
