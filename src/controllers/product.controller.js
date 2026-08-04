import { getProductsService, createProductService } from "../services/product.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await getProductsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService({ ...req.body, companyId: req.user?.companyId });
  res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});
