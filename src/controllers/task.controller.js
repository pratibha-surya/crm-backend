import { getTasksService, createTaskService, updateTaskStatusService } from "../services/task.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await getTasksService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await createTaskService({
    ...req.body,
    companyId: req.user?.companyId || req.body.companyId || "000000000000000000000000"
  });
  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await updateTaskStatusService(req.params.id, req.body.status);
  res.status(200).json(new ApiResponse(200, task, "Task status updated successfully"));
});
