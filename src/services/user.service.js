import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";

export const getAllUsersService = async (query = {}, companyId) => {
  const filter = { isDeleted: false, ...query };
  if (companyId) filter.companyId = companyId;
  return await User.find(filter).select("-password").sort({ createdAt: -1 });
};

export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user || user.isDeleted) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const createUserService = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }
  const user = await User.create(userData);
  const result = user.toObject();
  delete result.password;
  return result;
};

export const updateUserService = async (userId, updateData) => {
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
