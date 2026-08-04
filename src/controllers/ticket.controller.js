import {
  getTicketsService,
  getTicketByIdService,
  createTicketService,
  updateTicketService,
  resolveTicketService
} from "../services/ticket.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getTickets = asyncHandler(async (req, res) => {
  const tickets = await getTicketsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, tickets, "Tickets fetched successfully"));
});

export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await getTicketByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, ticket, "Ticket details fetched successfully"));
});

export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await createTicketService({ ...req.body, companyId: req.user?.companyId || req.body.companyId });
  res.status(201).json(new ApiResponse(201, ticket, "Ticket created successfully"));
});

export const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await updateTicketService(req.params.id, req.body, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, ticket, "Ticket updated successfully"));
});

export const resolveTicket = asyncHandler(async (req, res) => {
  const ticket = await resolveTicketService(req.params.id, req.user?.companyId, req.user?._id);
  res.status(200).json(new ApiResponse(200, ticket, "Ticket resolved successfully"));
});
