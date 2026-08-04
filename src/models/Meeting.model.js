import mongoose from "mongoose";

const { Schema, model } = mongoose;

const meetingSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    title: { type: String, required: true, trim: true },
    agenda: String,
    leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 30 },
    meetingPlatform: { type: String, enum: ["GOOGLE_MEET", "ZOOM", "IN_PERSON", "OTHER"], default: "GOOGLE_MEET" },
    meetingLink: String,
    attendees: [{ email: String, name: String }],
    minutesOfMeeting: String,
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["SCHEDULED", "COMPLETED", "CANCELLED"], default: "SCHEDULED" }
  },
  { timestamps: true }
);

export default model("Meeting", meetingSchema);
