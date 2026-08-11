import express from "express";
import {
  getQuotations,
  createQuotation,
  updateQuotationStatus
} from "../controllers/quotation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 09. Quotations
 *   description: Create and manage pricing quotations for customers
 */

/**
 * @swagger
 * /quotations:
 *   get:
 *     summary: Get all quotations
 *     description: "Retrieve a list of all records matching the authenticated context."
 *     tags: [09. Quotations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Quotations retrieved successfully"
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
 *                   example: "Quotations retrieved successfully"
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
router.get("/", checkPermission("quotations", "read"), getQuotations);

/**
 * @swagger
 * /quotations:
 *   post:
 *     summary: Create a new quotation
 *     description: "Instantiate and save a new record with the attributes specified in the request payload."
 *     tags: [09. Quotations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quotationNumber
 *               - items
 *               - subTotal
 *               - grandTotal
 *             properties:
 *               quotationNumber:
 *                 type: string
 *                 example: QT-2026-001
 *               leadId:
 *                 type: string
 *                 description: Lead ID for a pre-conversion quotation
 *                 example: 64f8c9d2e4b0a123456789ab
 *               customerId:
 *                 type: string
 *                 description: Customer ID when quoting an existing customer
 *                 example: 64f8c9d2e4b0a123456789ac
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
 *                     taxRate:
 *                       type: number
 *                     totalAmount:
 *                       type: number
 *                 example:
 *                   - name: "Software License"
 *                     quantity: 1
 *                     unitPrice: 1000
 *                     taxRate: 10
 *                     totalAmount: 1100
 *               subTotal:
 *                 type: number
 *                 example: 1000
 *               taxTotal:
 *                 type: number
 *                 example: 100
 *               grandTotal:
 *                 type: number
 *                 example: 1100
 *               validUntil:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *     responses:
 *       201:
 *         description: "Quotation created successfully"
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
 *                   example: "Quotation created successfully"
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
router.post("/", checkPermission("quotations", "create"), createQuotation);

/**
 * @swagger
 * /quotations/{id}/status:
 *   patch:
 *     summary: Update quotation status
 *     description: "Modify fields of the specified record matching the path parameter ID with the payload data."
 *     tags: [09. Quotations]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DRAFT, SENT, ACCEPTED, DECLINED, CONVERTED]
 *                 example: SENT
 *     responses:
 *       200:
 *         description: "Quotation status updated successfully"
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
 *                   example: "Quotation status updated successfully"
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
router.patch("/:id/status", checkPermission("quotations", "update"), updateQuotationStatus);

export default router;
