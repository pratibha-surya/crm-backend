import Quotation from "../models/Quotation.model.js";
import ApiError from "../utils/ApiError.js";

export const getQuotationsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Quotation.find(filter).populate("customerId", "companyName contactPerson email").sort({ createdAt: -1 });
};

export const createQuotationService = async (data) => {
  return await Quotation.create(data);
};

export const updateQuotationStatusService = async (id, status) => {
  const quotation = await Quotation.findByIdAndUpdate(id, { status }, { new: true });
  if (!quotation) throw new ApiError(404, "Quotation not found");
  return quotation;
};
