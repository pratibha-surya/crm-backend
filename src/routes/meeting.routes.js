import express from "express";
import { getMeetings, createMeeting } from "../controllers/meeting.controller.js";
import { validateMeetingPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 07. Meeting Management
 *   description: Schedule and track online/offline meetings
 */

/**
 * @swagger
 * /meetings:
 *   get:
 *     summary: Get all meetings
 *     tags: [07. Meeting Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Meetings retrieved successfully
 */
router.get("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), getMeetings);

/**
 * @swagger
 * /meetings:
 *   post:
 *     summary: Schedule a new meeting
 *     tags: [07. Meeting Management]
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
 *               - scheduledAt
 *             properties:
 *               title:
 *                 type: string
 *                 example: Product Demo with Client
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-15T14:30:00Z
 *               link:
 *                 type: string
 *                 example: https://meet.google.com/abc-defg-hij
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64f8c9d2e4b0a123456789ab"]
 *     responses:
 *       201:
 *         description: Meeting scheduled successfully
 */
router.post("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), validateMeetingPayload, createMeeting);

export default router;
