import User from "../models/User.model.js";
import Customer from "../models/Customer.model.js";
import Lead from "../models/Lead.model.js";
import Deal from "../models/Deal.model.js";
import Invoice from "../models/Invoice.model.js";
import Ticket from "../models/Ticket.model.js";

export const getReportsOverviewService = async (companyId) => {
  const filter = companyId ? { companyId } : {};

  const [users, customers, leads, deals, invoices, tickets] = await Promise.all([
    User.countDocuments(filter),
    Customer.countDocuments(filter),
    Lead.countDocuments(filter),
    Deal.countDocuments(filter),
    Invoice.countDocuments(filter),
    Ticket.countDocuments(filter)
  ]);

  return {
    users,
    customers,
    leads,
    deals,
    invoices,
    tickets,
    generatedAt: new Date().toISOString()
  };
};

export const getSalesReportService = async (companyId) => {
  const filter = companyId ? { companyId } : {};

  const revenue = await Invoice.aggregate([
    { $match: filter },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
  ]);

  return {
    totalRevenue: revenue[0]?.totalRevenue || 0,
    generatedAt: new Date().toISOString()
  };
};
