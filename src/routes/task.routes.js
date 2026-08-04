import express from "express";
import { getTasks, createTask, updateTaskStatus } from "../controllers/task.controller.js";
import { validateTaskPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 08. Task Management
 *   description: Manage daily tasks, priorities, and deadlines
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [08. Task Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 */
router.get("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), getTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [08. Task Management]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: Call the client for follow up
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: HIGH
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: 2026-10-20
 *               assignedTo:
 *                 type: string
 *                 example: 64f8c9d2e4b0a123456789ab
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"), validateTaskPayload, createTask);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     tags: [08. Task Management]
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
 *                 example: Completed
 *     responses:
 *       200:
 *         description: Task status updated successfully
 */
router.patch("/:id/status", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), updateTaskStatus);

export default router;
