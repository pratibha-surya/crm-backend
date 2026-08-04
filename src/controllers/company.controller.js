import {
  getCompaniesService,
  getCompanyByIdService,
  createCompanyService,
  updateCompanyService,
  updateCompanySubscriptionService
} from "../services/company.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await getCompaniesService(req.query);
  return res.status(200).json(new ApiResponse(200, companies, "Companies fetched successfully"));
});

export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await getCompanyByIdService(req.params.id);
  return res.status(200).json(new ApiResponse(200, company, "Company details fetched successfully"));
});

export const createCompany = asyncHandler(async (req, res) => {
  const company = await createCompanyService(req.body);
  return res.status(201).json(new ApiResponse(201, company, "Company created successfully"));
});

export const updateCompany = asyncHandler(async (req, res) => {
  const company = await updateCompanyService(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, company, "Company updated successfully"));
});

export const updateCompanySubscription = asyncHandler(async (req, res) => {
  const company = await updateCompanySubscriptionService(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, company, "Company subscription updated successfully"));
});
