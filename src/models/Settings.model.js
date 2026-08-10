import mongoose from "mongoose";

const { Schema, model } = mongoose;

const settingsSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      unique: true,
      index: true,
    },

    company: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        default: "",
      },
      email: String,
      phone: String,
      website: String,
      address: String,
      gstNumber: String,
    },

    currency: {
      type: String,
      default: "INR",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    language: {
      type: String,
      default: "en",
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "light",
    },

    smtp: {
      host: String,
      port: Number,
      secure: {
        type: Boolean,
        default: false,
      },
      user: String,
      pass: String,
      fromEmail: String,
      fromName: String,
    },

    apiKeys: {
      imageKitPublicKey: String,
      imageKitPrivateKey: String,
      imageKitUrlEndpoint: String,

      razorpayKeyId: String,
      razorpayKeySecret: String,

      stripePublishableKey: String,
      stripeSecretKey: String,

      openAiApiKey: String,
    },

    invoice: {
      prefix: {
        type: String,
        default: "INV-",
      },

      startingNumber: {
        type: Number,
        default: 1001,
      },

      terms: {
        type: String,
        default: "",
      },

      notes: {
        type: String,
        default: "",
      },
    },

    notifications: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      browser: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

export default model("Settings", settingsSchema);