import ApiError from "../utils/ApiError.js";

export const validateCustomerPayload = (req, res, next) => {
  const { companyName, contactPerson, email, phone, companyId } = req.body;
  let resolvedCompanyId = req.user?.companyId || companyId;

  if (!resolvedCompanyId) {
    // Fallback companyId for super admin or manual testing without companyId
    resolvedCompanyId = "000000000000000000000000";
    req.body.companyId = resolvedCompanyId;
  }

  if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
    throw new ApiError(400, "Customer company name is required");
  }

  if (!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === "") {
    throw new ApiError(400, "Customer contact person is required");
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new ApiError(400, "Valid customer email is required");
  }

  if (!phone || typeof phone !== "string" || phone.trim() === "") {
    throw new ApiError(400, "Customer phone is required");
  }

  next();
};

export const validateTaskPayload = (req, res, next) => {
  const { title } = req.body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new ApiError(400, "Task title is required");
  }
  next();
};

export const validateDealPayload = (req, res, next) => {
  const { title, dealValue } = req.body;
  if (!title) throw new ApiError(400, "Deal title is required");
  if (dealValue === undefined || dealValue < 0) throw new ApiError(400, "Valid deal value is required");
  next();
};

export const validateMeetingPayload = (req, res, next) => {
  const { title, scheduledAt } = req.body;
  if (!title) throw new ApiError(400, "Meeting title is required");
  if (!scheduledAt) throw new ApiError(400, "Meeting scheduled time is required");
  next();
};

export const validateTicketPayload = (req, res, next) => {
  const { subject, description, customerId } = req.body;
  if (!subject) throw new ApiError(400, "Ticket subject is required");
  if (!description) throw new ApiError(400, "Ticket description is required");
  if (!customerId) throw new ApiError(400, "Customer ID is required");
  next();
};

export const validateProductPayload = (req, res, next) => {
  const { name, sku, price } = req.body;
  if (!name) throw new ApiError(400, "Product name is required");
  if (!sku) throw new ApiError(400, "Product SKU is required");
  if (price === undefined || price < 0) throw new ApiError(400, "Valid product price is required");
  next();
};
