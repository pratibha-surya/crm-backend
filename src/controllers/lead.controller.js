import { 
  getLeadsService, 
  createLeadService, 
  updateLeadStatusService,
  getLeadByIdService,
  updateLeadService,
  deleteLeadService,
  addLeadNoteService,
  assignLeadService
} from "../services/lead.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getLeads = asyncHandler(async (req, res) => {
  const leads = await getLeadsService(req.query, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, leads, "Leads fetched successfully"));
});

export const getLeadById = asyncHandler(async (req, res) => {
  const lead = await getLeadByIdService(req.params.id, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, lead, "Lead details fetched successfully"));
});

export const createLead = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId || req.body.companyId || "000000000000000000000000";
  const userName = `${req.user?.firstName || "System"} ${req.user?.lastName || "User"}`;
  const lead = await createLeadService({ ...req.body, companyId }, userName);
  return res.status(201).json(new ApiResponse(201, lead, "Lead created successfully"));
});

export const updateLead = asyncHandler(async (req, res) => {
  const userName = `${req.user?.firstName || "System"} ${req.user?.lastName || "User"}`;
  const lead = await updateLeadService(req.params.id, req.body, req.user?.companyId, userName);
  return res.status(200).json(new ApiResponse(200, lead, "Lead updated successfully"));
});

export const deleteLead = asyncHandler(async (req, res) => {
  await deleteLeadService(req.params.id, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, null, "Lead deleted successfully"));
});

export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userName = `${req.user?.firstName || "System"} ${req.user?.lastName || "User"}`;

  if (!status) throw new ApiError(400, "Lead status is required");

  const updatedLead = await updateLeadStatusService(id, status, userName);
  if (!updatedLead) throw new ApiError(404, "Lead not found");

  return res.status(200).json(new ApiResponse(200, updatedLead, "Lead status updated successfully"));
});

export const assignLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const userName = `${req.user?.firstName || "System"} ${req.user?.lastName || "User"}`;

  if (!userId) throw new ApiError(400, "User ID is required to assign lead");

  const assignedLead = await assignLeadService(id, userId, userName);
  if (!assignedLead) throw new ApiError(404, "Lead not found");

  return res.status(200).json(new ApiResponse(200, assignedLead, "Lead assigned successfully"));
});

export const addLeadNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const authorName = `${req.user?.firstName || "System"} ${req.user?.lastName || "User"}`;

  if (!text) throw new ApiError(400, "Note text is required");

  const lead = await addLeadNoteService(id, { text, authorName, createdAt: new Date() }, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, lead, "Note added successfully"));
});

export const exportLeadsCSV = asyncHandler(async (req, res) => {
  const leads = await getLeadsService(req.query, req.user?.companyId);
  
  // Format as basic CSV
  let csv = "ID,Title,Contact Person,Email,Phone,Company Name,Source,Status,Lead Score\n";
  leads.forEach(lead => {
    csv += `"${lead._id}","${lead.title || ""}","${lead.contactPerson || ""}","${lead.email || ""}","${lead.phone || ""}","${lead.companyName || ""}","${lead.source || ""}","${lead.status || ""}",${lead.leadScore || 0}\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  return res.status(200).send(csv);
});

export const importLeadsCSV = asyncHandler(async (req, res) => {
  const { leads } = req.body; // Expects JSON array representing rows
  if (!Array.isArray(leads)) throw new ApiError(400, "Import payload must be an array of leads");

  const companyId = req.user?.companyId || "000000000000000000000000";
  const userName = `${req.user?.firstName || "System"} ${req.user?.lastName || "User"}`;
  
  const createdLeads = [];
  for (const leadData of leads) {
    const lead = await createLeadService({ ...leadData, companyId }, userName);
    createdLeads.push(lead);
  }

  return res.status(201).json(new ApiResponse(201, createdLeads, `${createdLeads.length} leads imported successfully`));
});
