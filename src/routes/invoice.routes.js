import express from "express";
import {
  getInvoices,
  createInvoice,
  updatePaymentStatus
} from "../controllers/invoice.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 10. Invoice
 *   description: Manage billing, GST, and payment status for customers
 */

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get all invoices
 *     description: "Retrieve a list of all records matching the authenticated context."
 *     tags: [10. Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Invoices retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Invoices retrieved successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
 *       400:
 *         description: "Validation Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "field is required"
 *       401:
 *         description: "Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Authentication token invalid or expired."*/
router.get("/", checkPermission("invoices", "read"), getInvoices);

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [10. Invoice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoiceNumber
 *               - customerId
 *               - items
 *               - subTotal
 *               - grandTotal
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *                 example: INV-2026-001
 *               quotationId:
 *                 type: string
 *                 description: ID of the quotation this invoice was converted from (optional)
 *                 example: 64f8c9d2e4b0a123456789ac
 *               customerId:
 *                 type: string
 *                 example: 64f8c9d2e4b0a123456789ad
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unitPrice:
 *                       type: number
 *                     gstRate:
 *                       type: number
 *                     totalAmount:
 *                       type: number
 *                 example:
 *                   - name: "Enterprise Server Setup"
 *                     quantity: 1
 *                     unitPrice: 50000
 *                     gstRate: 18
 *                     totalAmount: 59000
 *               subTotal:
 *                 type: number
 *                 example: 50000
 *               gstTotal:
 *                 type: number
 *                 example: 9000
 *               grandTotal:
 *                 type: number
 *                 example: 59000
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-11-30
 *     responses:
 *       201:
 *         description: "Invoice created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Invoice created successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
 *       400:
 *         description: "Validation Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "field is required"
 *       401:
 *         description: "Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Authentication token invalid or expired."*/
router.post("/", checkPermission("invoices", "create"), createInvoice);

/**
 * @swagger
 * /invoices/{id}/payment:
 *   patch:
 *     summary: Update payment status
 *     description: "Modify fields of the specified record matching the path parameter ID with the payload data."
 *     tags: [10. Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [UNPAID, PARTIALLY_PAID, PAID, OVERDUE]
 *                 example: PAID
 *     responses:
 *       200:
 *         description: "Invoice payment status updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Invoice payment status updated successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
 *       400:
 *         description: "Validation Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "field is required"
 *       401:
 *         description: "Unauthorized"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Authentication token invalid or expired."*/
router.patch("/:id/payment", checkPermission("invoices", "update"), updatePaymentStatus);

export default router;
