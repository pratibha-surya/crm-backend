import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import leadRoutes from "./lead.routes.js";
import roleRoutes from "./role.routes.js";
import customerRoutes from "./customer.routes.js";
import quotationRoutes from "./quotation.routes.js";
import invoiceRoutes from "./invoice.routes.js";
import taskRoutes from "./task.routes.js";
import dealRoutes from "./deal.routes.js";
import meetingRoutes from "./meeting.routes.js";
import ticketRoutes from "./ticket.routes.js";
import productRoutes from "./product.routes.js";
import companyRoutes from "./company.routes.js";
import settingsRoutes from "./settings.routes.js";
import reportRoutes from "./report.routes.js";
import branchRoutes from "./branch.routes.js";
import departmentRoutes from "./department.routes.js";
import designationRoutes from "./designation.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import followupRoutes from "./followup.routes.js";
import paymentRoutes from "./payment.routes.js";
import leaveRoutes from "./leave.routes.js";
import calendarRoutes from "./calendar.routes.js";
import auditLogRoutes from "./auditLog.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import inquiryRoutes from "./inquiry.route.js";
import notificationRoutes from "./notification.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "CRM API operational with modular Controllers, Services, Validators & Routes",
    timestamp: new Date().toISOString()
  });
});

import otpRoutes from "./otp.routes.js";

router.use("/auth", authRoutes);
router.use("/auth", otpRoutes);
router.use("/users", userRoutes);
router.use("/leads", leadRoutes);
router.use("/roles", roleRoutes);
router.use("/customers", customerRoutes);
router.use("/quotations", quotationRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/tasks", taskRoutes);
router.use("/deals", dealRoutes);
router.use("/meetings", meetingRoutes);
router.use("/tickets", ticketRoutes);
router.use("/products", productRoutes);
router.use("/companies", companyRoutes);
router.use("/settings", settingsRoutes);
router.use("/reports", reportRoutes);
router.use("/branches", branchRoutes);
router.use("/departments", departmentRoutes);
router.use("/designations", designationRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/followups", followupRoutes);
router.use("/payments", paymentRoutes);
router.use("/leaves", leaveRoutes);
router.use("/calendar", calendarRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/notifications", notificationRoutes);

export default router;
