import {
  getInvoicesService,
  createInvoiceService,
  updatePaymentStatusService,
  convertQuotationToInvoiceService
} from "../services/invoice.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await getInvoicesService(req.query, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, invoices, "Invoices fetched successfully"));
});

export const createInvoice = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId || req.body.companyId || "000000000000000000000000";
  const invoice = await createInvoiceService({
    ...req.body,
    companyId
  });
  return res.status(201).json(new ApiResponse(201, invoice, "Invoice created successfully"));
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const updated = await updatePaymentStatusService(req.params.id, req.body.paymentStatus, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, updated, "Invoice payment status updated"));
});

export const convertQuotationToInvoice = asyncHandler(async (req, res) => {
  const invoice = await convertQuotationToInvoiceService(req.params.id, req.user?.companyId, {
    invoiceNumber: req.body.invoiceNumber,
    dueDate: req.body.dueDate,
    createdBy: req.user?._id
  });
  return res.status(201).json(new ApiResponse(201, invoice, "Quotation converted to invoice successfully"));
});
