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
 *     tags: [02. Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics loaded successfully
 */
router.get("/stats", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), getDashboardStats);

export default router;
