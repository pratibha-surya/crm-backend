import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

export const getProductsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Product.find(filter).sort({ name: 1 });
};

export const createProductService = async (data) => {
  return await Product.create(data);
};

export const getProductByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const product = await Product.findOne(filter);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const updateProductService = async (id, updateData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const product = await Product.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const deleteProductService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const product = await Product.findOneAndDelete(filter);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};
