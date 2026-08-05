import express from "express";
import { 
  getReportsOverview, 
  getSalesReport,
  getRevenueReport,
  getEmployeeReport,
  getCustomerReport,
  getLeadConversionReport,
  exportReportCSV
} from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 17. Reports
 *   description: Aggregate analytics and exportable CSV reports for sales, employees, conversions, and customers (Module 17)
 */

/**
 * @swagger
 * /reports/overview:
 *   get:
 *     summary: Get overall metrics overview
 *     tags: [17. Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview fetched successfully
 */
router.get("/overview", checkPermission("reports", "read"), getReportsOverview);

/**
 * @swagger
 * /reports/sales:
 *   get:
 *     summary: Get sales revenue summary report
 *     tags: [17. Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales report fetched successfully
 */
router.get("/sales", checkPermission("reports", "read"), getSalesReport);

/**
 * @swagger
 * /reports/revenue:
 *   get:
 *     summary: Get detailed payments revenue report
 *     tags: [17. Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue report fetched successfully
 */
router.get("/revenue", checkPermission("reports", "read"), getRevenueReport);

/**
 * @swagger
 * /reports/employee:
 *   get:
 *     summary: Get employee engagement and logins report
 *     tags: [17. Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee report fetched successfully
 */
router.get("/employee", checkPermission("reports", "read"), getEmployeeReport);

/**
 * @swagger
 * /reports/customer:
 *   get:
 *     summary: Get customer database listing report
 *     tags: [17. Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer report fetched successfully
 */
router.get("/customer", checkPermission("reports", "read"), getCustomerReport);

/**
 * @swagger
 * /reports/conversion:
 *   get:
 *     summary: Get lead win/loss conversion rates report
 *     tags: [17. Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversion report fetched successfully
 */
router.get("/conversion", checkPermission("reports", "read"), getLeadConversionReport);

/**
 * @swagger
 * /reports/export:
 *   get:
 *     summary: Export selected report to a CSV file
 *     tags: [17. Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [revenue, employee, customer, conversion]
 *         description: The type of report to export to CSV
 *     responses:
 *       200:
 *         description: CSV file download containing requested report data
 */
router.get("/export", checkPermission("reports", "read"), exportReportCSV);

export default router;
