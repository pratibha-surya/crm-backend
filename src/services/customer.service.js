import Customer from "../models/Customer.model.js";
import ApiError from "../utils/ApiError.js";

export const getCustomersService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Customer.find(filter).sort({ createdAt: -1 });
};

export const getCustomerByIdService = async (customerId, companyId) => {
  const filter = companyId ? { _id: customerId, companyId } : { _id: customerId };
  const customer = await Customer.findOne(filter);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }
  return customer;
};

export const createCustomerService = async (customerData) => {
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
