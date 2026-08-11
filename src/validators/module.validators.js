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

export const validateLeadPayload = (req, res, next) => {
  const { title, contactPerson } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new ApiError(400, "Lead title is required");
  }

  if (!contactPerson || typeof contactPerson !== "string" || contactPerson.trim() === "") {
    throw new ApiError(400, "Lead contact person is required");
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
  const { name, sku, price, companyId } = req.body;
  let resolvedCompanyId = req.user?.companyId || companyId;

  if (!resolvedCompanyId) {
    resolvedCompanyId = "000000000000000000000000";
  }
  req.body.companyId = resolvedCompanyId;

  if (!name) throw new ApiError(400, "Product name is required");
  if (!sku) throw new ApiError(400, "Product SKU is required");
  if (price === undefined || price < 0) throw new ApiError(400, "Valid product price is required");
  next();
};

export const validateBranchPayload = (req, res, next) => {
  const { name, code } = req.body;
  if (!name) throw new ApiError(400, "Branch name is required");
  if (!code) throw new ApiError(400, "Branch code identifier is required");
  next();
};

export const validateDepartmentPayload = (req, res, next) => {
  const { name, code } = req.body;
  if (!name) throw new ApiError(400, "Department name is required");
  if (!code) throw new ApiError(400, "Department code identifier is required");
  next();
};

export const validateDesignationPayload = (req, res, next) => {
  const { name, code } = req.body;
  if (!name) throw new ApiError(400, "Designation name is required");
  if (!code) throw new ApiError(400, "Designation code identifier is required");
  next();
};

export const validateAttendancePayload = (req, res, next) => {
  const { employeeId, date, status } = req.body;
  if (!employeeId) throw new ApiError(400, "Employee ID is required");
  if (!date) throw new ApiError(400, "Attendance log date is required");
  if (!status || !["PRESENT", "ABSENT", "LATE", "LEAVE"].includes(status)) {
    throw new ApiError(400, "Valid attendance status (PRESENT, ABSENT, LATE, LEAVE) is required");
  }
  next();
};

export const validateLeavePayload = (req, res, next) => {
  const { startDate, endDate, type, reason } = req.body;
  if (!startDate) throw new ApiError(400, "Leave start date is required");
  if (!endDate) throw new ApiError(400, "Leave end date is required");
  if (!type || !["SICK", "CASUAL", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"].includes(type)) {
    throw new ApiError(400, "Valid leave type (SICK, CASUAL, EARNED, MATERNITY, PATERNITY, UNPAID) is required");
  }
  if (!reason) throw new ApiError(400, "Leave request reason is required");
  next();
};

export const validateFollowupPayload = (req, res, next) => {
  const { title, dueDate, leadId } = req.body;
  if (!title) throw new ApiError(400, "Followup title is required");
  if (!dueDate) throw new ApiError(400, "Followup due date is required");
  if (!leadId) throw new ApiError(400, "Lead ID association is required");
  next();
};

export const validatePaymentPayload = (req, res, next) => {
  const { invoiceId, amount, paymentMethod } = req.body;
  if (!invoiceId) throw new ApiError(400, "Invoice ID association is required");
  if (amount === undefined || amount <= 0) throw new ApiError(400, "Valid payment amount is required");
  if (!paymentMethod || !["CASH", "BANK_TRANSFER", "CREDIT_CARD", "UPI", "OTHER"].includes(paymentMethod)) {
    throw new ApiError(400, "Valid payment method (CASH, BANK_TRANSFER, CREDIT_CARD, UPI, OTHER) is required");
  }
  next();
};
