import Lead from "../models/Lead.model.js";

export const getLeadsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Lead.find(filter).populate("assignedTo", "firstName lastName email").sort({ createdAt: -1 });
};

export const createLeadService = async (leadData, userName = "System") => {
  const data = {
    ...leadData,
    timeline: [{ activity: "Lead created", performedBy: userName }]
  };
  return await Lead.create(data);
};

export const getLeadByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const lead = await Lead.findOne(filter).populate("assignedTo", "firstName lastName email");
  if (!lead) throw new ApiError(404, "Lead not found");
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

export const updateLeadStatusService = async (leadId, status, userName = "System") => {
  return await Lead.findByIdAndUpdate(
    leadId,
    { 
      status,
      $push: { timeline: { activity: `Status updated to ${status}`, performedBy: userName } }
    },
    { new: true }
  );
};

export const assignLeadService = async (leadId, userId, userName = "System") => {
  const lead = await Lead.findById(leadId);
  if (!lead) return null;
  
  lead.assignedTo = userId;
  lead.timeline.push({ activity: `Assigned to user ID ${userId}`, performedBy: userName });
  await lead.save();
  return await lead.populate("assignedTo", "firstName lastName email");
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
