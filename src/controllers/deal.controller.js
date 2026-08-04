import { getDealsService, createDealService, updateDealStageService } from "../services/deal.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDeals = asyncHandler(async (req, res) => {
  const deals = await getDealsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, deals, "Deals fetched successfully"));
});

export const createDeal = asyncHandler(async (req, res) => {
  const deal = await createDealService({ ...req.body, companyId: req.user?.companyId });
  res.status(201).json(new ApiResponse(201, deal, "Deal created successfully"));
});

export const updateDealStage = asyncHandler(async (req, res) => {
  const deal = await updateDealStageService(req.params.id, req.body.stage);
  res.status(200).json(new ApiResponse(200, deal, "Deal stage updated successfully"));
});
