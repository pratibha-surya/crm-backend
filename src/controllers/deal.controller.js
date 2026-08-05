import { 
  getDealsService, 
  createDealService, 
  updateDealStageService,
  getDealByIdService,
  updateDealService,
  deleteDealService,
  getSalesForecastService
} from "../services/deal.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDeals = asyncHandler(async (req, res) => {
  const deals = await getDealsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, deals, "Deals fetched successfully"));
});

export const getDealById = asyncHandler(async (req, res) => {
  const deal = await getDealByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, deal, "Deal details fetched successfully"));
});

export const createDeal = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId || req.body.companyId || "000000000000000000000000";
  const deal = await createDealService({ ...req.body, companyId });
  res.status(201).json(new ApiResponse(201, deal, "Deal created successfully"));
});

export const updateDeal = asyncHandler(async (req, res) => {
  const deal = await updateDealService(req.params.id, req.body, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, deal, "Deal updated successfully"));
});

export const deleteDeal = asyncHandler(async (req, res) => {
  await deleteDealService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Deal deleted successfully"));
});

export const updateDealStage = asyncHandler(async (req, res) => {
  const deal = await updateDealStageService(req.params.id, req.body.stage);
  res.status(200).json(new ApiResponse(200, deal, "Deal stage updated successfully"));
});

export const getSalesForecast = asyncHandler(async (req, res) => {
  const forecast = await getSalesForecastService(req.user?.companyId);
  res.status(200).json(new ApiResponse(200, forecast, "Sales forecast calculations retrieved successfully"));
});
