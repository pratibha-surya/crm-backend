import {
  getReportsOverviewService,
  getSalesReportService,
  getRevenueReportService,
  getEmployeeReportService,
  getCustomerReportService,
  getLeadConversionReportService
} from "../services/report.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getReportsOverview = asyncHandler(async (req, res) => {
  const report = await getReportsOverviewService(req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, report, "Reports overview fetched successfully"));
});

export const getSalesReport = asyncHandler(async (req, res) => {
  const report = await getSalesReportService(req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, report, "Sales report fetched successfully"));
});

export const getRevenueReport = asyncHandler(async (req, res) => {
  const report = await getRevenueReportService(req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, report, "Revenue report fetched successfully"));
});

export const getEmployeeReport = asyncHandler(async (req, res) => {
  const report = await getEmployeeReportService(req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, report, "Employee report fetched successfully"));
});

export const getCustomerReport = asyncHandler(async (req, res) => {
  const report = await getCustomerReportService(req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, report, "Customer report fetched successfully"));
});

export const getLeadConversionReport = asyncHandler(async (req, res) => {
  const report = await getLeadConversionReportService(req.user?.companyId);
  return res.status(200).json(new ApiResponse(200, report, "Lead conversion report fetched successfully"));
});

export const exportReportCSV = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const companyId = req.user?.companyId;
  let csv = "";
  let filename = "report.csv";

  if (type === "revenue") {
    const data = await getRevenueReportService(companyId);
    csv = "Payment ID,Invoice Number,Amount,Method,Date\n";
    data.payments.forEach(p => {
      csv += `"${p._id}","${p.invoiceId?.invoiceNumber || ""}","${p.amount || 0}","${p.paymentMethod || ""}","${p.createdAt || ""}"\n`;
    });
    filename = "revenue_report.csv";
  } else if (type === "employee") {
    const data = await getEmployeeReportService(companyId);
    csv = "First Name,Last Name,Email,Role,Is Active\n";
    data.employees.forEach(e => {
      csv += `"${e.firstName || ""}","${e.lastName || ""}","${e.email || ""}","${e.role || ""}","${e.isActive || false}"\n`;
    });
    filename = "employee_report.csv";
  } else if (type === "customer") {
    const data = await getCustomerReportService(companyId);
    csv = "Customer ID,Company Name,Contact Person,Email,Phone\n";
    data.customers.forEach(c => {
      csv += `"${c._id}","${c.companyName || ""}","${c.contactPerson || ""}","${c.email || ""}","${c.phone || ""}"\n`;
    });
    filename = "customer_report.csv";
  } else if (type === "conversion") {
    const data = await getLeadConversionReportService(companyId);
    csv = "Metric,Value\n";
    csv += `"Total Leads",${data.totalLeads}\n`;
    csv += `"Converted Leads (WON)",${data.convertedLeads}\n`;
    csv += `"Lost Leads",${data.lostLeads}\n`;
    csv += `"Conversion Rate","${data.conversionRate}"\n`;
    filename = "lead_conversion_report.csv";
  } else {
    throw new ApiError(400, "Invalid or missing report type. Allowed types: revenue, employee, customer, conversion.");
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  return res.status(200).send(csv);
});
