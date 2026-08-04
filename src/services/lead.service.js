import Lead from "../models/Lead.model.js";

export const getLeadsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Lead.find(filter).populate("assignedTo", "firstName lastName email").sort({ createdAt: -1 });
};

export const createLeadService = async (leadData) => {
  return await Lead.create(leadData);
};

export const updateLeadStatusService = async (leadId, status) => {
  return await Lead.findByIdAndUpdate(leadId, { status }, { new: true });
};

export const assignLeadService = async (leadId, userId) => {
  return await Lead.findByIdAndUpdate(leadId, { assignedTo: userId }, { new: true }).populate("assignedTo", "firstName lastName email");
};
