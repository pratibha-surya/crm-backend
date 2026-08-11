import Task from "../models/Task.model.js";
import Meeting from "../models/Meeting.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getCalendarEvents = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId;
  const filter = {};
  if (companyId) filter.companyId = companyId;

  // Fetch tasks and meetings concurrently
  const [tasks, meetings] = await Promise.all([
    Task.find(filter).sort({ deadline: 1 }),
    Meeting.find(filter).sort({ scheduledAt: 1 })
  ]);

  // Transform tasks into calendar event format
  const taskEvents = tasks.map(task => ({
    id: task._id,
    title: `[Task] ${task.title}`,
    date: task.deadline,
    type: "TASK",
    priority: task.priority,
    status: task.status,
    rawDetails: task
  }));

  // Transform meetings into calendar event format
  const meetingEvents = meetings.map(meeting => ({
    id: meeting._id,
    title: `[Meeting] ${meeting.title}`,
    date: meeting.scheduledAt,
    type: "MEETING",
    priority: "high",
    status: "scheduled",
    rawDetails: meeting
  }));

  // Consolidate and sort chronologically
  const allEvents = [...taskEvents, ...meetingEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

  res.status(200).json(new ApiResponse(200, allEvents, "Calendar events consolidated successfully"));
});
