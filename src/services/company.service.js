import Company from "../models/Company.model.js";
import ApiError from "../utils/ApiError.js";

export const getCompaniesService = async (query = {}) => {
  return await Company.find(query).sort({ createdAt: -1 });
};

export const getCompanyByIdService = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) throw new ApiError(404, "Company not found");
  return company;
};

export const createCompanyService = async (companyData) => {
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
