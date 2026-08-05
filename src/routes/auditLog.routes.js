import express from "express";
import { getAuditLogs } from "../controllers/auditLog.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 18. Audit Log
 *   description: System activity logs, login history, and record modifications (Module 18)
 */

/**
 * @swagger
 * /audit-logs:
 *   get:
 *     summary: Retrieve company audit logs
 *     tags: [18. Audit Log]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *         description: Filter logs by module name
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter logs by action type
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 */
router.get("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"), getAuditLogs);

export default router;
