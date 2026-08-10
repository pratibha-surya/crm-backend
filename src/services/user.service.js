import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

export const getAllUsersService = async (query = {}, companyId) => {
  const filter = { isDeleted: false, ...query };
  if (companyId) filter.companyId = companyId;
  return await User.find(filter)
    .select("-password")
    .populate("branchId", "name")
    .populate("departmentId", "name")
    .populate("designationId", "name")
    .sort({ createdAt: -1 });
};

export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId)
    .select("-password")
    .populate("branchId", "name")
    .populate("departmentId", "name")
    .populate("designationId", "name");
  if (!user || user.isDeleted) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const cleanUserObjectIds = (userData) => {
  const fields = ["companyId", "branchId", "departmentId", "designationId"];
  fields.forEach((field) => {
    if (userData[field] === "" || userData[field] === null || userData[field] === undefined) {
      delete userData[field];
    }
  });
};

export const createUserService = async (userData) => {
  cleanUserObjectIds(userData);
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password || "Password@123", salt);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
    isActive: false,
    isVerified: false
  });

  const { saveOTP } = await import("../utils/otp.js");
  const otpCode = await saveOTP(user.email, "REGISTRATION");
  await sendOtpEmail(user.email, otpCode, "REGISTRATION", userData.password || "Password@123");

  const result = user.toObject();
  delete result.password;
  return result;
};

export const updateUserService = async (userId, updateData) => {
  cleanUserObjectIds(updateData);
  if (updateData.password) {
    delete updateData.password;
  }
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const deleteUserService = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true, isActive: false },
    { new: true }
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
