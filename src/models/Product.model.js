import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: "General" },
    unit: { type: String, default: "pcs" },
    tax: { type: Number, default: 0 },
    price: { type: Number, required: true, default: 0 },
    cost: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    barcode: { type: String, default: "" },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default model("Product", productSchema);
