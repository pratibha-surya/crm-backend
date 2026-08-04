import Invoice from "../models/Invoice.model.js";
import ApiError from "../utils/ApiError.js";

export const getInvoicesService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Invoice.find(filter).populate("customerId", "companyName contactPerson email").sort({ createdAt: -1 });
};

export const createInvoiceService = async (data) => {
  return await Invoice.create(data);
};

export const updatePaymentStatusService = async (id, paymentStatus) => {
  const invoice = await Invoice.findByIdAndUpdate(id, { paymentStatus }, { new: true });
  if (!invoice) throw new ApiError(404, "Invoice not found");
  return invoice;
};
