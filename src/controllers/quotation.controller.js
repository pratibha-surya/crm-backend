import {
  getQuotationsService,
  createQuotationService,
  updateQuotationStatusService
} from "../services/quotation.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getQuotations = asyncHandler(async (req, res) => {
  const quotations = await getQuotationsService(req.query, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, quotations, "Quotations fetched successfully"));
});

export const createQuotation = asyncHandler(async (req, res) => {
  const companyId = req.user?.companyId || req.body.companyId || "000000000000000000000000";
  const quotation = await createQuotationService({
    ...req.body,
    companyId
  });
  return res.status(201).json(new ApiResponse(201, quotation, "Quotation created successfully"));
});

export const updateQuotationStatus = asyncHandler(async (req, res) => {
  const updated = await updateQuotationStatusService(req.params.id, req.body.status);
  return res.status(200).json(new ApiResponse(200, updated, "Quotation status updated successfully"));
});
