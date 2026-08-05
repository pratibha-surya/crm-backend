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

export const getTaskByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const task = await Task.findOne(filter)
    .populate("assignedTo", "firstName lastName email")
    .populate("comments.userId", "firstName lastName email");
  if (!task) throw new ApiError(404, "Task not found");
  return task;
};

export const updateTaskService = async (id, updateData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const task = await Task.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
  if (!task) throw new ApiError(404, "Task not found");
  return task;
};

export const deleteTaskService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const task = await Task.findOneAndDelete(filter);
  if (!task) throw new ApiError(404, "Task not found");
  return task;
};

export const updateTaskStatusService = async (id, status) => {
  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
  if (!task) throw new ApiError(404, "Task not found");
  return task;
};

export const addTaskCommentService = async (id, commentData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const task = await Task.findOne(filter);
  if (!task) throw new ApiError(404, "Task not found");
  
  task.comments.push(commentData);
  await task.save();
  return task;
};

export const addTaskAttachmentService = async (id, attachmentData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const task = await Task.findOne(filter);
  if (!task) throw new ApiError(404, "Task not found");
  
  task.attachments.push(attachmentData);
  await task.save();
  return task;
};
