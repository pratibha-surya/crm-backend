import Quotation from "../models/Quotation.model.js";
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
  const existingQuotation = await Quotation.findOne({ companyId: data.companyId, quotationNumber: data.quotationNumber });
  if (existingQuotation) {
    throw new ApiError(409, "Quotation with this quotation number already exists in your company");
  }
  return await Quotation.create(data);
};

export const updateQuotationStatusService = async (id, status) => {
  const quotation = await Quotation.findByIdAndUpdate(id, { status }, { new: true });
  if (!quotation) throw new ApiError(404, "Quotation not found");
  return quotation;
};
