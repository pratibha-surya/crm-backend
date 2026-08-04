import Product from "../models/Product.model.js";
import ApiError from "../utils/ApiError.js";

export const getProductsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Product.find(filter).sort({ name: 1 });
};

export const createProductService = async (data) => {
  return await Product.create(data);
};
