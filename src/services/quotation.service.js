import Quotation from "../models/Quotation.model.js";
import Customer from "../models/Customer.model.js";
import Lead from "../models/Lead.model.js";
import ApiError from "../utils/ApiError.js";

export const getQuotationsService = async (query = {}, companyId) => {
  const { page = 1, limit = 10, search = "", status } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (companyId) filter.companyId = companyId;
  if (status) filter.status = status;
  if (search) {
    filter.quotationNumber = { $regex: search, $options: "i" };
  }

  const [quotations, total] = await Promise.all([
    Quotation.find(filter)
      .populate("customerId", "companyName contactPerson email")
      .populate("leadId", "title contactPerson email companyName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Quotation.countDocuments(filter)
  ]);

  return {
    quotations,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

export const createQuotationService = async (data) => {
  if (!data.leadId && !data.customerId) {
    throw new ApiError(400, "A lead or customer is required to create a quotation");
  }

  if (data.leadId) {
    const lead = await Lead.findOne({ _id: data.leadId, companyId: data.companyId });
    if (!lead) throw new ApiError(404, "Lead not found in your company");
  }

  if (data.customerId) {
    const customer = await Customer.findOne({ _id: data.customerId, companyId: data.companyId });
    if (!customer) throw new ApiError(404, "Customer not found in your company");
  }

  const existingQuotation = await Quotation.findOne({ companyId: data.companyId, quotationNumber: data.quotationNumber });
  if (existingQuotation) {
    throw new ApiError(409, "Quotation with this quotation number already exists in your company");
  }
  return await Quotation.create(data);
};

export const updateQuotationStatusService = async (id, status, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const quotation = await Quotation.findOneAndUpdate(filter, { status }, { new: true, runValidators: true });
  if (!quotation) throw new ApiError(404, "Quotation not found");
  return quotation;
};
