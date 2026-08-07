import Lead from "../models/Lead.model.js";
import Task from "../models/Task.model.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

export const getLeadsService = async (query = {}, companyId, user = null) => {
  const { page = 1, limit = 10, search = "", status } = query;

  console.log(`🔍 [getLeadsService] User Role: ${user?.role}, User ID: ${user?._id || user?.id}`);

  const filter = {};
  if (companyId && user?.role !== "SUPER_ADMIN") filter.companyId = companyId;

  if (user && user.role === "SALES_EXECUTIVE") {
    filter.assignedTo = new mongoose.Types.ObjectId(String(user._id || user.id));
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { contactPerson: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const parsedLimit = parseInt(limit);

  const leads = await Lead.find(filter)
    .populate("assignedTo", "firstName lastName email")
    .populate("assignedBy", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit);

  const total = await Lead.countDocuments(filter);

  return {
    leads,
    pagination: {
      total,
      page: parseInt(page),
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit)
    }
  };
};

export const createLeadService = async (leadData, userName = "System") => {
  const data = {
    ...leadData,
    timeline: [{ activity: "Lead created", performedBy: userName }]
  };
  const lead = await Lead.create(data);

  if (lead.assignedTo) {
    await Task.create({
      companyId: lead.companyId || "000000000000000000000000",
      title: `Follow up with newly created lead: ${lead.title}`,
      description: `Initial contact and follow up task for new lead: ${lead.title} (${lead.contactPerson}).`,
      priority: "MEDIUM",
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      assignedTo: lead.assignedTo,
      leadId: lead._id
    });
  }
  return lead;
};

export const getLeadByIdService = async (id, companyId, user = null) => {
  const filter = companyId && user?.role !== "SUPER_ADMIN" ? { _id: id, companyId } : { _id: id };
  const lead = await Lead.findOne(filter)
    .populate("assignedTo", "firstName lastName email")
    .populate("assignedBy", "firstName lastName email");
  if (!lead) throw new ApiError(404, "Lead not found");

  if (user && user.role === "SALES_EXECUTIVE" && String(lead.assignedTo?._id || lead.assignedTo) !== String(user._id || user.id)) {
    throw new ApiError(403, "Access denied: You are only allowed to access your assigned leads");
  }

  return lead;
};

export const updateLeadService = async (id, updateData, companyId, userName = "System") => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const updatePayload = {
    ...updateData,
    $push: { timeline: { activity: "Lead details updated", performedBy: userName } }
  };
  const lead = await Lead.findOneAndUpdate(filter, updatePayload, { new: true, runValidators: true });
  if (!lead) throw new ApiError(404, "Lead not found");
  return lead;
};

export const deleteLeadService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const lead = await Lead.findOneAndDelete(filter);
  if (!lead) throw new ApiError(404, "Lead not found");
  return lead;
};

export const updateLeadStatusService = async (leadId, status, companyId, user = null, userName = "System") => {
  const filter = companyId && user?.role !== "SUPER_ADMIN" ? { _id: leadId, companyId } : { _id: leadId };
  const lead = await Lead.findOne(filter);
  if (!lead) return null;

  if (user && user.role === "SALES_EXECUTIVE" && String(lead.assignedTo?._id || lead.assignedTo) !== String(user._id || user.id)) {
    throw new ApiError(403, "Access denied: You are only allowed to update status for your assigned leads");
  }

  lead.status = status;
  lead.timeline.push({ activity: `Status updated to ${status}`, performedBy: userName });
  await lead.save();
  return lead;
};

export const assignLeadService = async (leadId, userId, userName = "System", assignedById = null) => {
  const lead = await Lead.findById(leadId);
  if (!lead) return null;
  
  lead.assignedTo = userId;
  if (assignedById) {
    lead.assignedBy = assignedById;
  }
  lead.timeline.push({ activity: `Assigned to user ID ${userId}`, performedBy: userName });
  await lead.save();

  // Auto-create a high priority call task for the assignee
  await Task.create({
    companyId: lead.companyId || "000000000000000000000000",
    title: `Call Customer: ${lead.title}`,
    description: `Call and contact lead: ${lead.title} (${lead.contactPerson}) following your new assignment.`,
    priority: "HIGH",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    assignedTo: userId,
    leadId: lead._id
  });

  return await lead.populate([
    { path: "assignedTo", select: "firstName lastName email" },
    { path: "assignedBy", select: "firstName lastName email" }
  ]);
};

export const addLeadNoteService = async (leadId, noteData, companyId) => {
  const filter = companyId ? { _id: leadId, companyId } : { _id: leadId };
  const lead = await Lead.findOne(filter);
  if (!lead) throw new ApiError(404, "Lead not found");
  
  lead.notes.push(noteData);
  lead.timeline.push({ activity: "Added a new note", performedBy: noteData.authorName });
  await lead.save();
  return lead;
};
