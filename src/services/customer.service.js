import Customer from "../models/Customer.model.js";
import ApiError from "../utils/ApiError.js";

export const getCustomersService = async (query = {}, companyId) => {
  const { page = 1, limit = 10, search = "", status } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (companyId) filter.companyId = companyId;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: "i" } },
      { contactPerson: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const [customers, total] = await Promise.all([
    Customer.find(filter).populate("assignedTo", "firstName lastName email").sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Customer.countDocuments(filter)
  ]);

  return {
    customers,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

export const getCustomerByIdService = async (customerId, companyId) => {
  const filter = companyId ? { _id: customerId, companyId } : { _id: customerId };
  const customer = await Customer.findOne(filter).populate("assignedTo", "firstName lastName email");
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }
  return customer;
};

export const createCustomerService = async (customerData) => {
  const existingCustomer = await Customer.findOne({ companyId: customerData.companyId, email: customerData.email.toLowerCase() });
  if (existingCustomer) {
    throw new ApiError(409, "Customer with this email already exists in your company");
  }
  return await Customer.create(customerData);
};

export const updateCustomerService = async (id, updateData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const customer = await Customer.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
  if (!customer) throw new ApiError(404, "Customer not found");
  return customer;
};

export const deleteCustomerService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const customer = await Customer.findOneAndDelete(filter);
  if (!customer) throw new ApiError(404, "Customer not found");
  return customer;
};
