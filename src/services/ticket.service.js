import Ticket from "../models/Ticket.model.js";
import ApiError from "../utils/ApiError.js";

export const getTicketsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Ticket.find(filter)
    .populate("customerId", "companyName contactPerson email phone")
    .populate("assignedTo", "firstName lastName email")
    .sort({ createdAt: -1 });
};

export const getTicketByIdService = async (ticketId, companyId) => {
  const filter = companyId ? { _id: ticketId, companyId } : { _id: ticketId };
  const ticket = await Ticket.findOne(filter)
    .populate("customerId", "companyName contactPerson email phone")
    .populate("assignedTo", "firstName lastName email");

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  return ticket;
};

export const createTicketService = async (data) => {
  const ticketNumber = data.ticketNumber || `TKT-${Date.now()}`;
  return await Ticket.create({ ...data, ticketNumber });
};

export const updateTicketService = async (ticketId, updateData, companyId) => {
  const filter = companyId ? { _id: ticketId, companyId } : { _id: ticketId };
  const ticket = await Ticket.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  return ticket;
};

export const resolveTicketService = async (ticketId, companyId, resolvedBy) => {
  const filter = companyId ? { _id: ticketId, companyId } : { _id: ticketId };
  const ticket = await Ticket.findOneAndUpdate(
    filter,
    {
      status: "RESOLVED",
      assignedTo: resolvedBy
    },
    { new: true, runValidators: true }
  );

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  return ticket;
};
