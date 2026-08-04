import SupportTicket from "../models/SupportTicket.model.js";
import ApiError from "../utils/ApiError.js";

export const getSupportTicketsService = async (companyId) => {
  return await SupportTicket.find({ companyId })
    .populate("customer", "name email phone")
    .populate("assignedEmployee", "firstName lastName email")
    .sort({ createdAt: -1 });
};

export const getSupportTicketByIdService = async (id, companyId) => {
  const ticket = await SupportTicket.findOne({
    _id: id,
    companyId,
  })
    .populate("customer")
    .populate("assignedEmployee")
    .populate("replies.user", "firstName lastName email");

  if (!ticket) {
    throw new ApiError(404, "Support ticket not found");
  }

  return ticket;
};

export const createSupportTicketService = async (data, companyId) => {
  return await SupportTicket.create({
    ...data,
    companyId,
  });
};

export const updateSupportTicketStatusService = async (
  id,
  companyId,
  status
) => {
  const ticket = await SupportTicket.findOneAndUpdate(
    {
      _id: id,
      companyId,
    },
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!ticket) {
    throw new ApiError(404, "Support ticket not found");
  }

  return ticket;
};

export const assignSupportTicketService = async (
  id,
  companyId,
  assignedEmployee
) => {
  const ticket = await SupportTicket.findOneAndUpdate(
    {
      _id: id,
      companyId,
    },
    {
      assignedEmployee,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!ticket) {
    throw new ApiError(404, "Support ticket not found");
  }

  return ticket;
};

export const replySupportTicketService = async (
  id,
  companyId,
  userId,
  message,
  attachments = []
) => {
  const ticket = await SupportTicket.findOne({
    _id: id,
    companyId,
  });

  if (!ticket) {
    throw new ApiError(404, "Support ticket not found");
  }

  ticket.replies.push({
    user: userId,
    message,
    attachments,
  });

  await ticket.save();

  return ticket;
};

export const closeSupportTicketService = async (
  id,
  companyId,
  userId
) => {
  const ticket = await SupportTicket.findOneAndUpdate(
    {
      _id: id,
      companyId,
    },
    {
      status: "CLOSED",
      closedAt: new Date(),
      closedBy: userId,
    },
    {
      new: true,
    }
  );

  if (!ticket) {
    throw new ApiError(404, "Support ticket not found");
  }

  return ticket;
};