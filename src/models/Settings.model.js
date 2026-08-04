import mongoose from "mongoose";

const { Schema, model } = mongoose;

const settingsSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true },
    currency: { type: String, default: "INR" },
    timezone: { type: String, default: "Asia/Kolkata" },
    language: { type: String, default: "en" },
    theme: { type: String, default: "light" },
    smtp: {
      host: String,
      port: Number,
      user: String,
      pass: String
    },
    invoicePrefix: { type: String, default: "INV-" }
  },
  { timestamps: true }
);

export default model("Settings", settingsSchema);
