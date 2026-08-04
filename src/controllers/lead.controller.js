import { getLeadsService, createLeadService, updateLeadStatusService } from "../services/lead.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getLeads = asyncHandler(async (req, res) => {
  const leads = await getLeadsService(req.query, req.user?.companyId);
  return res
    .status(200)
    .json(new ApiResponse(200, leads, "Leads fetched successfully"));
});

export const createLead = asyncHandler(async (req, res) => {
  const lead = await createLeadService({
    ...req.body,
    companyId: req.user?.companyId || req.body.companyId
  });
  return res
    .status(201)
    .json(new ApiResponse(201, lead, "Lead created successfully"));
});

export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Lead status is required");
  }

  const updatedLead = await updateLeadStatusService(id, status);
  if (!updatedLead) {
    throw new ApiError(404, "Lead not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedLead, "Lead status updated successfully"));
});
