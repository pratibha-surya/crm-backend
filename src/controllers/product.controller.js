import { 
  getProductsService, 
  createProductService, 
  getProductByIdService, 
  updateProductService, 
  deleteProductService 
} from "../services/product.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await getProductsService(req.query, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

export const createProduct = asyncHandler(async (req, res) => {
  const companyId = req.body.companyId || req.user?.companyId || "000000000000000000000000";
  const product = await createProductService({ ...req.body, companyId });
  res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await getProductByIdService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, product, "Product details fetched successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService(req.params.id, req.body, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService(req.params.id, req.user?.companyId);
  res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});
