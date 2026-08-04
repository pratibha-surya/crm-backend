import mongoose from "mongoose";

const { Schema, model } = mongoose;

const quotationSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    quotationNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    items: [
      {
        name: String,
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true },
        taxRate: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true }
      }
    ],
    subTotal: { type: Number, required: true },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    status: { type: String, enum: ["DRAFT", "SENT", "ACCEPTED", "DECLINED", "CONVERTED"], default: "DRAFT" },
    validUntil: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default model("Quotation", quotationSchema);
