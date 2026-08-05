import { 
  getTasksService, 
  createTaskService, 
  updateTaskStatusService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  addTaskCommentService,
  addTaskAttachmentService
} from "../services/task.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await getTasksService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await getTaskByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, task, "Task details fetched successfully"));
});

export const createTask = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId || req.body.companyId || "000000000000000000000000";
  const createdBy = req.user?._id;
  const task = await createTaskService({
    ...req.body,
    companyId,
    createdBy
  });
  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await updateTaskService(req.params.id, req.body, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

export const deleteTask = asyncHandler(async (req, res) => {
  await deleteTaskService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await updateTaskStatusService(req.params.id, req.body.status);
  res.status(200).json(new ApiResponse(200, task, "Task status updated successfully"));
});

export const addTaskComment = asyncHandler(async (req, res) => {
  const userId = req.user?._id || "000000000000000000000000";
  const userName = `${req.user?.firstName || "System"} ${req.user?.lastName || "User"}`;
  const comment = {
    userId,
    userName,
    text: req.body.text,
    createdAt: new Date()
  };

  const task = await addTaskCommentService(req.params.id, comment, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, task, "Comment added successfully"));
});

export const addTaskAttachment = asyncHandler(async (req, res) => {
  const attachment = {
    name: req.body.name,
    url: req.body.url
  };

  const task = await addTaskAttachmentService(req.params.id, attachment, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, task, "Attachment added successfully"));
});
