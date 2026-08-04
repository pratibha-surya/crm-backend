import Deal from "../models/Deal.model.js";
import ApiError from "../utils/ApiError.js";

export const getDealsService = async (query = {}, companyId) => {
  const filter = { ...query };
  if (companyId) filter.companyId = companyId;
  return await Deal.find(filter).populate("assignedTo", "firstName lastName email").sort({ createdAt: -1 });
};

export const createDealService = async (data) => {
  return await Deal.create(data);
};

export const updateDealStageService = async (id, stage) => {
  const deal = await Deal.findByIdAndUpdate(id, { stage }, { new: true });
  if (!deal) throw new ApiError(404, "Deal not found");
  return deal;
};
