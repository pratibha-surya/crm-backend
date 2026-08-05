import mongoose from "mongoose";

const { Schema, model } = mongoose;

const designationSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

designationSchema.index({ companyId: 1, code: 1 }, { unique: true });

export default model("Designation", designationSchema);
