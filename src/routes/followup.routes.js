import { validateFollowupPayload } from "../validators/module.validators.js";
import express from "express";
import { 
  getFollowups, 
  createFollowup, 
  updateFollowupStatus, 
  deleteFollowup 
} from "../controllers/followup.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 05. Lead Management
 *   description: Lead Follow-up Management (Module 5 Lead Management)
 */

/**
 * @swagger
 * /followups:
 *   get:
 *     summary: Get all lead follow-up schedules
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Followups list fetched successfully
 */
router.get(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"),
  getFollowups
);

/**
 * @swagger
 * /followups:
 *   post:
 *     summary: Create/Schedule a lead follow-up task
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *               - title
 *               - dueDate
 *             properties:
 *               leadId:
 *                 type: string
 *                 example: 6511b0e2f9d3b80012345678
 *               title:
 *                 type: string
 *                 example: Call client to discuss quotation feedback
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-10T11:00:00.000Z
 *               type:
 *                 type: string
 *                 enum: [call, email, whatsapp, demo, meeting]
 *                 example: call
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               channel:
 *                 type: string
 *                 example: Phone Call
 *     responses:
 *       201:
 *         description: Followup task created successfully
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"),
  validateFollowupPayload,
  createFollowup
);

/**
 * @swagger
 * /followups/{id}/status:
 *   patch:
 *     summary: Update follow-up task status
 *     tags: [05. Lead Management]
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
 *                 enum: [pending, completed, cancelled]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Followup status updated successfully
 */
router.patch(
  "/:id/status",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"),
  updateFollowupStatus
);

/**
 * @swagger
 * /followups/{id}:
 *   delete:
 *     summary: Delete a follow-up task
 *     tags: [05. Lead Management]
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
 *         description: Followup task deleted successfully
 */
router.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  deleteFollowup
);

export default router;
