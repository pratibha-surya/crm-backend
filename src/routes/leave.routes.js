import { validateLeavePayload } from "../validators/module.validators.js";
import express from "express";
import { 
  getLeaves, 
  getLeaveById, 
  createLeave, 
  updateLeaveStatus, 
  deleteLeave 
} from "../controllers/leave.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 03. User Management
 *   description: Leave Application Management (Module 3 / Operations)
 */

/**
 * @swagger
 * /leaves:
 *   get:
 *     summary: Get all leave applications
 *     tags: [03. User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaves list fetched successfully
 */
router.get(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "ACCOUNTANT", "CUSTOMER_SUPPORT"),
  getLeaves
);

/**
 * @swagger
 * /leaves/{id}:
 *   get:
 *     summary: Get leave application by ID
 *     tags: [03. User Management]
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
 *         description: Leave details fetched successfully
 */
router.get(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "ACCOUNTANT", "CUSTOMER_SUPPORT"),
  getLeaveById
);

/**
 * @swagger
 * /leaves:
 *   post:
 *     summary: Submit a new leave request
 *     tags: [03. User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6511b0e2f9d3b80012345678
 *               leaveType:
 *                 type: string
 *                 enum: [CASUAL, SICK, MATERNITY, PATERNITY, UNPAID, OTHER]
 *                 example: CASUAL
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-15
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-18
 *               reason:
 *                 type: string
 *                 example: Family event.
 *     responses:
 *       201:
 *         description: Leave request submitted successfully
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "ACCOUNTANT", "CUSTOMER_SUPPORT"),
  validateLeavePayload,
  createLeave
);

/**
 * @swagger
 * /leaves/{id}/status:
 *   patch:
 *     summary: Approve or Reject a leave application
 *     tags: [03. User Management]
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
 *                 enum: [PENDING, APPROVED, REJECTED]
 *                 example: APPROVED
 *               notes:
 *                 type: string
 *                 example: Leave approved.
 *     responses:
 *       200:
 *         description: Leave status updated successfully
 */
router.patch(
  "/:id/status",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  validateLeavePayload,
  updateLeaveStatus
);

/**
 * @swagger
 * /leaves/{id}:
 *   delete:
 *     summary: Cancel/Delete a leave application
 *     tags: [03. User Management]
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
 *         description: Leave request cancelled/deleted successfully
 */
router.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  deleteLeave
);

export default router;
