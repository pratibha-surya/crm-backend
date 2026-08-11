import Invoice from "../models/Invoice.model.js";
import Quotation from "../models/Quotation.model.js";
import ApiError from "../utils/ApiError.js";

export const getInvoicesService = async (query = {}, companyId) => {
  const { page = 1, limit = 10, search = "", status } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (companyId) filter.companyId = companyId;
  if (status) filter.status = status;
  if (search) {
    filter.invoiceNumber = { $regex: search, $options: "i" };
  }

  const [invoices, total] = await Promise.all([
    Invoice.find(filter)
      .populate("customerId", "companyName contactPerson email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Invoice.countDocuments(filter)
  ]);

  return {
    invoices,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

export const createInvoiceService = async (data) => {
  const existingInvoice = await Invoice.findOne({ companyId: data.companyId, invoiceNumber: data.invoiceNumber });
  if (existingInvoice) {
    throw new ApiError(409, "Invoice with this invoice number already exists in your company");
  }
  return await Invoice.create(data);
};

export const updatePaymentStatusService = async (id, paymentStatus, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const invoice = await Invoice.findOneAndUpdate(filter, { paymentStatus }, { new: true, runValidators: true });
  if (!invoice) throw new ApiError(404, "Invoice not found");
  return invoice;
};

export const convertQuotationToInvoiceService = async (quotationId, companyId, invoiceData = {}) => {
  if (!invoiceData.invoiceNumber) {
    throw new ApiError(400, "Invoice number is required");
  }

  const quotation = await Quotation.findOne({ _id: quotationId, companyId });
  if (!quotation) throw new ApiError(404, "Quotation not found");
  if (quotation.status !== "ACCEPTED") {
    throw new ApiError(409, "Only an accepted quotation can be converted to an invoice");
  }
  if (!quotation.customerId) {
    throw new ApiError(409, "Convert the lead to a customer before creating an invoice");
  }

  const existingInvoice = await Invoice.findOne({ companyId, quotationId: quotation._id });
  if (existingInvoice) throw new ApiError(409, "An invoice already exists for this quotation");

  const invoiceNumber = String(invoiceData.invoiceNumber).trim();
  const duplicateNumber = await Invoice.findOne({ companyId, invoiceNumber });
  if (duplicateNumber) throw new ApiError(409, "Invoice number already exists in your company");

  const invoice = await Invoice.create({
    companyId,
    invoiceNumber,
    quotationId: quotation._id,
    customerId: quotation.customerId,
    items: quotation.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      gstRate: item.taxRate,
      totalAmount: item.totalAmount
    })),
    subTotal: quotation.subTotal,
    gstTotal: quotation.taxTotal,
    grandTotal: quotation.grandTotal,
    dueDate: invoiceData.dueDate,
    createdBy: invoiceData.createdBy
  });

  quotation.status = "CONVERTED";
  await quotation.save();
  return invoice;
};
