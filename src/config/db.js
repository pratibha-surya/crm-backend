import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.model.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/crm_live_db");
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);

    // Seed default Company Admin if not exists
    const adminExists = await User.findOne({ email: "ananya.rao@northwind.io" });
    if (!adminExists) {
      console.log("🌱 Seeding default Company Admin...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Password@123", salt);

      await User.create({
        firstName: "Ananya",
        lastName: "Rao",
        email: "ananya.rao@northwind.io",
        password: hashedPassword,
        role: "COMPANY_ADMIN",
        companyId: "000000000000000000000000", // Default test company
        isActive: true,
        isVerified: true
      });
      console.log("✅ Seeded default admin user: ananya.rao@northwind.io / Password@123");
    }

    // Ensure admin@gmail.com is COMPANY_ADMIN, active, and verified
    const localAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (localAdmin) {
      localAdmin.role = "COMPANY_ADMIN";
      localAdmin.isActive = true;
      localAdmin.isVerified = true;
      await localAdmin.save();
      console.log("✅ Ensured admin@gmail.com is COMPANY_ADMIN with full verified access");
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Fallback to allow app startup without blocking if DB is offline
  }
};

export default connectDB;