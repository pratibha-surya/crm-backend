import Lead from "../models/Lead.model.js";
import Customer from "../models/Customer.model.js";
import Task from "../models/Task.model.js";
import Meeting from "../models/Meeting.model.js";
import Deal from "../models/Deal.model.js";
import Payment from "../models/Payment.model.js";
import User from "../models/User.model.js";
import AuditLog from "../models/AuditLog.model.js";

export const getDashboardStatsService = async (companyId) => {
  const filter = {};
  if (companyId) filter.companyId = companyId;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 1. Today's Leads count
  const todayLeadsCount = await Lead.countDocuments({
    ...filter,
    createdAt: { $gte: startOfToday }
  });

  // 2. Sales Revenue (Sum of all payment amounts)
  const payments = await Payment.find(filter);
  const salesRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  // 3. New Customers Count (created in last 30 days)
  const newCustomersCount = await Customer.countDocuments({
    ...filter,
    createdAt: { $gte: thirtyDaysAgo }
  });

  // 4. Pending Tasks Count
  const pendingTasksCount = await Task.countDocuments({
    ...filter,
    status: { $in: ["PENDING", "IN_PROGRESS"] }
  });

  // 5. Upcoming Meetings Count
  const upcomingMeetingsCount = await Meeting.countDocuments({
    ...filter,
    scheduledAt: { $gte: now }
  });

  // 6. Pipeline Stats (count by deal stage)
  const deals = await Deal.find(filter);
  const pipelineStats = {
    PROSPECT: 0,
    QUALIFIED: 0,
    MEETING: 0,
    PROPOSAL: 0,
    NEGOTIATION: 0,
    WON: 0,
    LOST: 0
  };
  deals.forEach(deal => {
    if (pipelineStats[deal.stage] !== undefined) {
      pipelineStats[deal.stage] += 1;
    }
  });

  // 7. Lead Sources distribution
  const allLeads = await Lead.find(filter);
  const leadSources = {
    WEBSITE: 0,
    FACEBOOK: 0,
    GOOGLE_ADS: 0,
    REFERRAL: 0,
    COLD_CALL: 0,
    WALK_IN: 0,
    IMPORT: 0,
    OTHER: 0
  };
  allLeads.forEach(l => {
    const src = l.source || "OTHER";
    if (leadSources[src] !== undefined) {
      leadSources[src] += 1;
    } else {
      leadSources.OTHER += 1;
    }
  });

  // 8. Recent Activities (Fetch last 10 audit logs)
  const recentActivities = await AuditLog.find(filter)
    .populate("userId", "firstName lastName email")
    .sort({ createdAt: -1 })
    .limit(10);

  // 9. Monthly Sales & Revenue Graph Data (group payments by month)
  const revenueGraph = {};
  payments.forEach(p => {
    const month = p.createdAt ? new Date(p.createdAt).toLocaleString("default", { month: "short", year: "numeric" }) : "Unknown";
    revenueGraph[month] = (revenueGraph[month] || 0) + (p.amount || 0);
  });

  // 10. Deals Won count
  const dealsWonCount = await Deal.countDocuments({ ...filter, stage: "WON" });

  // 11. Customer Growth (group customers by month)
  const allCustomers = await Customer.find(filter);
  const customerGrowth = {};
  allCustomers.forEach(c => {
    const month = c.createdAt ? new Date(c.createdAt).toLocaleString("default", { month: "short", year: "numeric" }) : "Unknown";
    customerGrowth[month] = (customerGrowth[month] || 0) + 1;
  });

  // 12. Top Employees (User task completions)
  const completedTasks = await Task.find({ ...filter, status: "COMPLETED" }).populate("assignedTo", "firstName lastName");
  const employeePerformance = {};
  completedTasks.forEach(task => {
    if (task.assignedTo) {
      const name = `${task.assignedTo.firstName} ${task.assignedTo.lastName}`;
      employeePerformance[name] = (employeePerformance[name] || 0) + 1;
    }
  });
  const topEmployees = Object.entries(employeePerformance)
    .map(([name, count]) => ({ name, completedTasksCount: count }))
    .sort((a, b) => b.completedTasksCount - a.completedTasksCount)
    .slice(0, 5);

  return {
    widgets: {
      todayLeadsCount,
      salesRevenue,
      newCustomersCount,
      pendingTasksCount,
      upcomingMeetingsCount,
      dealsWonCount
    },
    pipelineStats,
    leadSources,
    topEmployees,
    recentActivities,
    charts: {
      revenueGraph,
      customerGrowth
    }
  };
};
