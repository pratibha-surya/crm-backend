import {
  getTicketsService,
  getTicketByIdService,
  createTicketService,
  updateTicketService,
  resolveTicketService,
  closeTicketService,
  addTicketReplyService,
  addTicketAttachmentService
} from "../services/ticket.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

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

export const closeTicket = asyncHandler(async (req, res) => {
  const ticket = await closeTicketService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, ticket, "Ticket closed successfully"));
});

export const addTicketReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user?._id || "000000000000000000000000";
  const authorName = `${req.user?.firstName || "Support"} ${req.user?.lastName || "Agent"}`;

  if (!text) throw new ApiError(400, "Reply text is required");

  const ticket = await addTicketReplyService(id, { userId, authorName, text, createdAt: new Date() }, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, ticket, "Reply added successfully"));
});

export const addTicketAttachment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, url } = req.body;

  if (!name || !url) throw new ApiError(400, "Attachment name and url are required");

  const ticket = await addTicketAttachmentService(id, { name, url }, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, ticket, "Attachment added successfully"));
});
