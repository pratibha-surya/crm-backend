import Invoice from "../models/Invoice.model.js";
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

export const updatePaymentStatusService = async (id, paymentStatus) => {
  const invoice = await Invoice.findByIdAndUpdate(id, { paymentStatus }, { new: true });
  if (!invoice) throw new ApiError(404, "Invoice not found");
  return invoice;
};
