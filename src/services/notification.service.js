import Notification from "../models/Notification.model.js";
import ApiError from "../utils/ApiError.js";

export const getUserNotificationsService = async (companyId, userId) => {
  const targetCompanyId = companyId || "000000000000000000000000";
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Fetch notifications sorted by newest first, limited to the latest 50
  const notifications = await Notification.find({ companyId: targetCompanyId, userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
    
  return notifications;
};

export const markNotificationAsReadService = async (companyId, userId, notificationId) => {
  const targetCompanyId = companyId || "000000000000000000000000";
  if (!notificationId) {
    throw new ApiError(400, "Notification ID is required");
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, companyId: targetCompanyId, userId },
    { $set: { read: true } },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found or access denied");
  }

  return notification;
};

export const markAllNotificationsAsReadService = async (companyId, userId) => {
  const targetCompanyId = companyId || "000000000000000000000000";
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  await Notification.updateMany(
    { companyId: targetCompanyId, userId, read: false },
    { $set: { read: true } }
  );

  return { success: true };
};
