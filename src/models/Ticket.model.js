import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ticketSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    ticketNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "URGENT"], default: "MEDIUM" },
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], default: "OPEN", index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
    replies: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        authorName: String,
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

export default model("Ticket", ticketSchema);
