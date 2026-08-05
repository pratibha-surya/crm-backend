import User from "../models/User.model.js";
import Customer from "../models/Customer.model.js";
import Lead from "../models/Lead.model.js";
import Deal from "../models/Deal.model.js";
import Invoice from "../models/Invoice.model.js";
import Ticket from "../models/Ticket.model.js";
import Payment from "../models/Payment.model.js";

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

export const getRevenueReportService = async (companyId) => {
  const filter = companyId ? { companyId } : {};
  const payments = await Payment.find(filter).populate("invoiceId", "invoiceNumber");
  const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  return {
    totalRevenue,
    paymentsCount: payments.length,
    payments,
    generatedAt: new Date().toISOString()
  };
};

export const getEmployeeReportService = async (companyId) => {
  const filter = companyId ? { companyId } : {};
  const employees = await User.find(filter).select("firstName lastName email role isActive lastLogin");
  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.isActive).length,
    employees,
    generatedAt: new Date().toISOString()
  };
};

export const getCustomerReportService = async (companyId) => {
  const filter = companyId ? { companyId } : {};
  const customers = await Customer.find(filter);
  return {
    totalCustomers: customers.length,
    customers,
    generatedAt: new Date().toISOString()
  };
};

export const getLeadConversionReportService = async (companyId) => {
  const filter = companyId ? { companyId } : {};
  const totalLeads = await Lead.countDocuments(filter);
  const convertedLeads = await Lead.countDocuments({ ...filter, status: "WON" });
  const lostLeads = await Lead.countDocuments({ ...filter, status: "LOST" });
  
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
  
  return {
    totalLeads,
    convertedLeads,
    lostLeads,
    conversionRate: conversionRate.toFixed(2) + "%",
    generatedAt: new Date().toISOString()
  };
};
