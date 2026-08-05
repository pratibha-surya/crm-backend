import { 
  getPaymentsService, 
  getPaymentByIdService, 
  createPaymentService, 
  deletePaymentService 
} from "../services/payment.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const getPayments = asyncHandler(async (req, res) => {
  const payments = await getPaymentsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, payments, "Payments fetched successfully"));
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await getPaymentByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, payment, "Payment details fetched successfully"));
});

export const createPayment = asyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user?.companyId || "000000000000000000000000";
  const payment = await createPaymentService({ ...req.body, companyId });
  res.status(201).json(new ApiResponse(201, payment, "Payment recorded successfully"));
});

export const deletePayment = asyncHandler(async (req, res) => {
  await deletePaymentService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Payment record deleted successfully"));
});
