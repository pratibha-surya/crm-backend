import mongoose from "mongoose";

const { Schema, model } = mongoose;

const leadSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    title: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true },
    email: String,
    phone: String,
    companyName: String,
    source: {
      type: String,
      enum: ["WEBSITE", "FACEBOOK", "GOOGLE_ADS", "REFERRAL", "COLD_CALL", "WALK_IN", "IMPORT", "OTHER"],
      default: "WEBSITE"
    },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"],
      default: "NEW",
      index: true
    },
    leadScore: { type: Number, default: 0 },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: [
      {
        text: { type: String, required: true },
        authorName: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    timeline: [
      {
        activity: { type: String, required: true },
        performedBy: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default model("Lead", leadSchema);
