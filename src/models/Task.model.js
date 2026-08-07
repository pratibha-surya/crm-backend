import mongoose from "mongoose";

const { Schema, model } = mongoose;

const taskSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "MEDIUM" },
    deadline: Date,
    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"], default: "PENDING", index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    isRecurring: { type: Boolean, default: false },
    recurrence: {
      frequency: { type: String, enum: ["DAILY", "WEEKLY", "MONTHLY", "NONE"], default: "NONE" },
      nextOccurrence: Date
    },
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        userName: String,
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    attachments: [
      {
        name: String,
        url: String
      }
    ]
  },
  { timestamps: true }
);

export default model("Task", taskSchema);
