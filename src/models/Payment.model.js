import mongoose from "mongoose";

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["CASH", "BANK_TRANSFER", "CREDIT_CARD", "UPI", "OTHER"],
      default: "BANK_TRANSFER"
    },
    transactionId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["SUCCESS", "PENDING", "FAILED"],
      default: "SUCCESS",
      index: true
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default model("Payment", paymentSchema);
