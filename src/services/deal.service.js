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

export const getDealByIdService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const deal = await Deal.findOne(filter)
    .populate("assignedTo", "firstName lastName email")
    .populate("customerId", "companyName contactPerson email");
  if (!deal) throw new ApiError(404, "Deal not found");
  return deal;
};

export const updateDealService = async (id, updateData, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const deal = await Deal.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });
  if (!deal) throw new ApiError(404, "Deal not found");
  return deal;
};

export const deleteDealService = async (id, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const deal = await Deal.findOneAndDelete(filter);
  if (!deal) throw new ApiError(404, "Deal not found");
  return deal;
};

export const updateDealStageService = async (id, stage, companyId) => {
  const filter = companyId ? { _id: id, companyId } : { _id: id };
  const deal = await Deal.findOneAndUpdate(filter, { stage }, { new: true, runValidators: true });
  if (!deal) throw new ApiError(404, "Deal not found");
  return deal;
};

export const getSalesForecastService = async (companyId) => {
  const filter = {};
  if (companyId) filter.companyId = companyId;

  const deals = await Deal.find(filter);

  let totalValue = 0;
  let totalProjectedValue = 0;
  const stageBreakdown = {
    PROSPECT: { count: 0, value: 0, projectedValue: 0 },
    QUALIFIED: { count: 0, value: 0, projectedValue: 0 },
    MEETING: { count: 0, value: 0, projectedValue: 0 },
    PROPOSAL: { count: 0, value: 0, projectedValue: 0 },
    NEGOTIATION: { count: 0, value: 0, projectedValue: 0 },
    WON: { count: 0, value: 0, projectedValue: 0 },
    LOST: { count: 0, value: 0, projectedValue: 0 }
  };

  deals.forEach(deal => {
    const val = deal.dealValue || 0;
    const prob = deal.probability || 0;
    const projected = val * (prob / 100);

    totalValue += val;
    totalProjectedValue += projected;

    if (stageBreakdown[deal.stage]) {
      stageBreakdown[deal.stage].count += 1;
      stageBreakdown[deal.stage].value += val;
      stageBreakdown[deal.stage].projectedValue += projected;
    }
  });

  return {
    totalDealsCount: deals.length,
    totalValue,
    totalProjectedValue,
    stageBreakdown
  };
};
