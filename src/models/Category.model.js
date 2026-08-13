import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    name: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

categorySchema.index({ companyId: 1, name: 1 }, { unique: true });

export default model("Category", categorySchema);
