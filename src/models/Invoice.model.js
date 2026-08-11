import mongoose from "mongoose";

const { Schema, model } = mongoose;

const invoiceSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    invoiceNumber: { type: String, required: true, trim: true },
    quotationId: { type: Schema.Types.ObjectId, ref: "Quotation", index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    items: [
      {
        name: String,
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        gstRate: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true }
      }
    ],
    subTotal: { type: Number, required: true },
    gstTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["UNPAID", "PARTIALLY_PAID", "PAID", "OVERDUE"], default: "UNPAID", index: true },
    dueDate: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

invoiceSchema.index({ companyId: 1, invoiceNumber: 1 }, { unique: true });

export default model("Invoice", invoiceSchema);
