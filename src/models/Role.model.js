import mongoose from "mongoose";

const { Schema, model } = mongoose;

const roleSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    description: String,
    permissions: [
      {
        type: String // Matches permissions string array e.g. ["customers:create", "leads:read"]
      }
    ],
    isSystemDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default model("Role", roleSchema);
