import mongoose from "mongoose";

const { Schema, model } = mongoose;

const leaveSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    leaveType: {
      type: String,
      enum: ["CASUAL", "SICK", "MATERNITY", "PATERNITY", "UNPAID", "OTHER"],
      default: "CASUAL"
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default model("Leave", leaveSchema);
