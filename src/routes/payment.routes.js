import { validatePaymentPayload } from "../validators/module.validators.js";
import express from "express";
import { 
  getPayments, 
  getPaymentById, 
  createPayment, 
  deletePayment 
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 10. Invoice
 *   description: Invoice Payment Management (Sales Domain)
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags: [10. Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments list fetched successfully
 */
router.get(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "ACCOUNTANT"),
  getPayments
);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment details by ID
 *     tags: [10. Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment details fetched successfully
 */
router.get(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "ACCOUNTANT"),
  getPaymentById
);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Record a payment transaction
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
 *               - invoiceId
 *               - amount
 *             properties:
 *               invoiceId:
 *                 type: string
 *                 example: 6511b0e2f9d3b80012345678
 *               amount:
 *                 type: number
 *                 example: 55000
 *               paymentDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-05T13:40:00.000Z
 *               paymentMethod:
 *                 type: string
 *                 enum: [CASH, BANK_TRANSFER, CREDIT_CARD, UPI, OTHER]
 *                 example: UPI
 *               transactionId:
 *                 type: string
 *                 example: TXN-99887711
 *               status:
 *                 type: string
 *                 enum: [SUCCESS, PENDING, FAILED]
 *                 example: SUCCESS
 *               notes:
 *                 type: string
 *                 example: Paid in full via GPay.
 *     responses:
 *       201:
 *         description: Payment registered successfully
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "ACCOUNTANT"),
  validatePaymentPayload,
  createPayment
);

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Remove/Delete a payment transaction
 *     tags: [10. Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment record deleted successfully
 */
router.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  deletePayment
);

export default router;
