import mongoose from "mongoose";

const { Schema, model } = mongoose;

const dealSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    title: { type: String, required: true, trim: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
    stage: {
      type: String,
      enum: ["PROSPECT", "QUALIFIED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON", "LOST"],
      default: "PROSPECT",
      index: true
    },
    dealValue: { type: Number, required: true, default: 0 },
    probability: { type: Number, default: 20 },
    expectedClosingDate: Date,
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true }
  },
  { timestamps: true }
);

export default model("Deal", dealSchema);
