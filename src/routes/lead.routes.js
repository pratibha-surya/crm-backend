import express from "express";
import {
  getLeads,
  createLead,
  updateLeadStatus,
  assignLead
} from "../controllers/lead.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 05. Lead Management
 *   description: Sales pipeline leads, opportunities, and deal tracking
 */

/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Get all leads for the authenticated company
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leads fetched successfully
 */
router.get("/", checkPermission("leads", "read"), getLeads);

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead/opportunity
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
 *               - title
 *               - contactPerson
 *             properties:
 *               title:
 *                 type: string
 *                 example: Enterprise Software Requirement
 *               contactPerson:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               companyName:
 *                 type: string
 *                 example: Tech Corp
 *               source:
 *                 type: string
 *                 enum: [WEBSITE, FACEBOOK, GOOGLE_ADS, REFERRAL, COLD_CALL, WALK_IN, IMPORT, OTHER]
 *                 example: WEBSITE
 *               status:
 *                 type: string
 *                 enum: [NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST]
 *                 example: NEW
 *               leadScore:
 *                 type: number
 *                 example: 75
 *               assignedTo:
 *                 type: string
 *                 description: User ID of the sales rep assigned
 *                 example: 64f8c9d2e4b0a123456789ab
 *     responses:
 *       201:
 *         description: Lead created successfully
 */
router.post("/", checkPermission("leads", "create"), createLead);

/**
 * @swagger
 * /leads/{id}/status:
 *   patch:
 *     summary: Update lead status
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
 *                 enum: [NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST]
 *                 example: QUALIFIED
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 */
router.patch("/:id/status", checkPermission("leads", "update"), updateLeadStatus);

/**
 * @swagger
 * /leads/{id}/assign:
 *   patch:
 *     summary: Assign lead to a user
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user (e.g. Sales Executive) to assign this lead to
 *                 example: 64f8c9d2e4b0a123456789ab
 *     responses:
 *       200:
 *         description: Lead assigned successfully
 */
router.patch("/:id/assign", checkPermission("leads", "update"), assignLead);

export default router;
