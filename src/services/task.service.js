import Task from "../models/Task.model.js";
import ApiError from "../utils/ApiError.js";

export const getTasksService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Task.find(filter).populate("assignedTo", "firstName lastName email").sort({ createdAt: -1 });
};

export const createTaskService = async (data) => {
  return await Task.create(data);
};

export const updateTaskStatusService = async (id, status) => {
  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
  if (!task) throw new ApiError(404, "Task not found");
  return task;
};
