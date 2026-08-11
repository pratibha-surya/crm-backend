import Task from "../models/Task.model.js";
import ApiError from "../utils/ApiError.js";

export const getTasksService = async (query = {}, companyId) => {
  const { page = 1, limit = 10, search = "", status, priority } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (companyId) filter.companyId = companyId;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("assignedTo", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Task.countDocuments(filter)
  ]);

  return {
    tasks,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
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

export const updateTaskStatusService = async (id, status, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const task = await Task.findOneAndUpdate(filter, { status }, { new: true, runValidators: true });
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
