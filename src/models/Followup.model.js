import mongoose from "mongoose";

const { Schema, model } = mongoose;

const followupSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    leadName: { type: String, required: true },
    company: { type: String, default: "" },
    assignedToName: { type: String, default: "Sales Rep" },
    type: {
      type: String,
      enum: ["call", "email", "whatsapp", "demo", "meeting"],
      default: "call"
    },
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
      index: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    channel: { type: String, default: "Phone Call" },
    reminderSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default model("Followup", followupSchema);
