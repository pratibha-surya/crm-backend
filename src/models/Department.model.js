import mongoose from "mongoose";

const { Schema, model } = mongoose;

const departmentSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", index: true },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    head: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

departmentSchema.index({ companyId: 1, code: 1 }, { unique: true });

export default model("Department", departmentSchema);
