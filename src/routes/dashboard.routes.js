import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 02. Dashboard
 *   description: Executive overview metrics, status widgets, performance charts, and audit alerts (Module 2)
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Retrieve aggregate performance statistics for widgets and graphs
 *     description: "Execute operations matching capabilities."
 *     tags: [02. Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Dashboard statistics loaded successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Dashboard overview metrics loaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     widgets:
 *                       type: object
 *                       properties:
 *                         todayLeadsCount:
 *                           type: integer
 *                           example: 12
 *                         salesRevenue:
 *                           type: number
 *                           example: 45250.75
 *                         newCustomersCount:
 *                           type: integer
 *                           example: 85
 *                         pendingTasksCount:
 *                           type: integer
 *                           example: 5
 *                         upcomingMeetingsCount:
 *                           type: integer
 *                           example: 3
 *                         dealsWonCount:
 *                           type: integer
 *                           example: 24
 *                     pipelineStats:
 *                       type: object
 *                       properties:
 *                         PROSPECT:
 *                           type: integer
 *                           example: 10
 *                         QUALIFIED:
 *                           type: integer
 *                           example: 5
 *                         MEETING:
 *                           type: integer
 *                           example: 3
 *                         PROPOSAL:
 *                           type: integer
 *                           example: 4
 *                         NEGOTIATION:
 *                           type: integer
 *                           example: 2
 *                         WON:
 *                           type: integer
 *                           example: 24
 *                         LOST:
 *                           type: integer
 *                           example: 1
 *                     leadSources:
 *                       type: object
 *                       properties:
 *                         WEBSITE:
 *                           type: integer
 *                           example: 15
 *                         FACEBOOK:
 *                           type: integer
 *                           example: 8
 *                         GOOGLE_ADS:
 *                           type: integer
 *                           example: 12
 *                     topEmployees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Suresh Raina"
 *                           completedTasksCount:
 *                             type: integer
 *                             example: 18
 *                     charts:
 *                       type: object
 *                       properties:
 *                         revenueGraph:
 *                           type: object
 *                           additionalProperties:
 *                             type: number
 *                           example: { "Jan 2026": 12000, "Feb 2026": 15000 }
 *                         customerGrowth:
 *                           type: object
 *                           additionalProperties:
 *                             type: integer
 *                           example: { "Jan 2026": 10, "Feb 2026": 15 }
 
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
router.get("/stats", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), getDashboardStats);

export default router;
