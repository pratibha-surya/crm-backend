import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

export const getProductsService = async (query = {}, companyId) => {
  const { page = 1, limit = 10, search = "", category } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (companyId) filter.companyId = companyId;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ name: 1 }).skip(skip).limit(limitNum),
    Product.countDocuments(filter)
  ]);

  return {
    products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

export const createProductService = async (data) => {
  const existingProduct = await Product.findOne({ companyId: data.companyId, sku: data.sku });
  if (existingProduct) {
    throw new ApiError(409, "Product with this SKU already exists in your company");
  }
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
