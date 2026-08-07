import express from "express";
import { getCalendarEvents } from "../controllers/calendar.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 08. Task Management
 *   description: Consolidated Calendar Feeds (Tasks & Meetings)
 */

/**
 * @swagger
 * /calendar:
 *   get:
 *     summary: Retrieve consolidated calendar schedule
 *     description: Fetches all tasks and meetings for the company, formatted as a unified chronological event list for calendar modules.
 *     tags: [08. Task Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Consolidated calendar events fetched successfully"
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
 *                   example: "Consolidated calendar events fetched successfully"
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
router.get(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "ACCOUNTANT", "CUSTOMER_SUPPORT"),
  getCalendarEvents
);

export default router;
