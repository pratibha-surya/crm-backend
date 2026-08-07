import Company from "../models/Company.model.js";
import ApiError from "../utils/ApiError.js";

export const getCompaniesService = async (query = {}) => {
  const { page = 1, limit = 10, search = "", status } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status) filter["subscription.status"] = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const [companies, total] = await Promise.all([
    Company.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Company.countDocuments(filter)
  ]);

  return {
    companies,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

export const getCompanyByIdService = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) throw new ApiError(404, "Company not found");
  return company;
};

export const createCompanyService = async (companyData) => {
  const existingCompany = await Company.findOne({ email: companyData.email.toLowerCase() });
  if (existingCompany) {
    throw new ApiError(409, "Company with this email already exists");
  }
  return await Company.create(companyData);
};

export const updateCompanyService = async (companyId, updateData) => {
  const company = await Company.findByIdAndUpdate(companyId, updateData, {
    new: true,
    runValidators: true
  });
  if (!company) throw new ApiError(404, "Company not found");
  return company;
};

export const updateCompanySubscriptionService = async (companyId, updateData) => {
  const company = await Company.findByIdAndUpdate(
    companyId,
    { subscription: { ...updateData } },
    { new: true, runValidators: true }
  );
  if (!company) throw new ApiError(404, "Company not found");
  return company;
};
