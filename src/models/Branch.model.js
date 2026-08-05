import mongoose from "mongoose";

const { Schema, model } = mongoose;

const branchSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    manager: { type: String, default: "" },
    city: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

branchSchema.index({ companyId: 1, code: 1 }, { unique: true });

export default model("Branch", branchSchema);
