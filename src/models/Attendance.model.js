import mongoose from "mongoose";

const { Schema, model } = mongoose;

const attendanceSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { type: String, enum: ["Present", "Absent", "Late", "Half Day", "On Leave"], default: "Present" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

// Compound index to ensure single attendance record per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default model("Attendance", attendanceSchema);
