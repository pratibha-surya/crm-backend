import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  getSupportTicketsService,
  getSupportTicketByIdService,
  createSupportTicketService,
  updateSupportTicketStatusService,
  assignSupportTicketService,
  replySupportTicketService,
  closeSupportTicketService,
} from "../services/support.service.js";

export const getSupportTickets = asyncHandler(async (req, res) => {
  const tickets = await getSupportTicketsService(req.user.companyId);

  res.status(200).json(
    new ApiResponse(200, tickets, "Support tickets fetched successfully")
  );
});

export const getSupportTicketById = asyncHandler(async (req, res) => {
  const ticket = await getSupportTicketByIdService(
    req.params.id,
    req.user.companyId
  );

  res.status(200).json(
    new ApiResponse(200, ticket, "Support ticket fetched successfully")
  );
});

export const createSupportTicket = asyncHandler(async (req, res) => {
  const ticket = await createSupportTicketService(
    req.body,
    req.user.companyId
  );

  res.status(201).json(
    new ApiResponse(201, ticket, "Support ticket created successfully")
  );
});

export const updateSupportTicketStatus = asyncHandler(async (req, res) => {
  const ticket = await updateSupportTicketStatusService(
    req.params.id,
    req.user.companyId,
    req.body.status
  );

  res.status(200).json(
    new ApiResponse(200, ticket, "Ticket status updated successfully")
  );
});

export const assignSupportTicket = asyncHandler(async (req, res) => {
  const ticket = await assignSupportTicketService(
    req.params.id,
    req.user.companyId,
    req.body.assignedEmployee
  );

  res.status(200).json(
    new ApiResponse(200, ticket, "Ticket assigned successfully")
  );
});

export const replySupportTicket = asyncHandler(async (req, res) => {
  const ticket = await replySupportTicketService(
    req.params.id,
    req.user.companyId,
    req.user._id,
    req.body.message,
    req.body.attachments
  );

  res.status(200).json(
    new ApiResponse(200, ticket, "Reply added successfully")
  );
});

export const closeSupportTicket = asyncHandler(async (req, res) => {
  const ticket = await closeSupportTicketService(
    req.params.id,
    req.user.companyId,
    req.user._id
  );

  res.status(200).json(
    new ApiResponse(200, ticket, "Support ticket closed successfully")
  );
});