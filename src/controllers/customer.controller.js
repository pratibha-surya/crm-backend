import {
  getCustomersService,
  getCustomerByIdService,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService
} from "../services/customer.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await getCustomersService(req.query, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, customers, "Customers fetched successfully"));
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await getCustomerByIdService(req.params.id, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, customer, "Customer details fetched successfully"));
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await createCustomerService({
    ...req.body,
    companyId: req.user?.companyId || req.body.companyId
  });
  return res.status(201).json(new ApiResponse(201, customer, "Customer created successfully"));
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const updated = await updateCustomerService(req.params.id, req.body, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, updated, "Customer updated successfully"));
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  await deleteCustomerService(req.params.id, req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, null, "Customer deleted successfully"));
});
