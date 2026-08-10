import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gstNumber: String,
    panNumber: String,
    industry: String,
    tags: [String],
    address: { street: String, city: String, state: String, country: String, zipCode: String },
    multipleContacts: [{ name: String, email: String, phone: String, designation: String }],
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true }
  },
  { timestamps: true }
);

export default model("Customer", customerSchema);
