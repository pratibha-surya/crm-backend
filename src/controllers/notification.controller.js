import { 
  getUserNotificationsService, 
  markNotificationAsReadService, 
  markAllNotificationsAsReadService 
} from "../services/notification.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId;
  const userId = req.user?._id;

  const notifications = await getUserNotificationsService(companyId, userId);
  return res.status(200).json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId;
  const userId = req.user?._id;
  const { id } = req.params;

  const notification = await markNotificationAsReadService(companyId, userId, id);
  return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId;
  const userId = req.user?._id;

  await markAllNotificationsAsReadService(companyId, userId);
  return res.status(200).json(new ApiResponse(200, null, "All notifications marked as read"));
});
