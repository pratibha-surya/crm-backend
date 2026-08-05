import express from "express";
import { 
  getTasks, 
  createTask, 
  updateTaskStatus,
  getTaskById,
  updateTask,
  deleteTask,
  addTaskComment,
  addTaskAttachment
} from "../controllers/task.controller.js";
import { validateTaskPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 08. Task Management
 *   description: Manage daily tasks, priorities, deadlines, comments, and attachments (Module 8)
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
 * /tasks/{id}:
 *   get:
 *     summary: Get task details by ID
 *     tags: [08. Task Management]
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
 *         description: Task details retrieved successfully
 */
router.get("/:id", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), getTaskById);

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
 *               - assignedTo
 *             properties:
 *               title:
 *                 type: string
 *                 example: Call the client for follow up
 *               description:
 *                 type: string
 *                 example: Review feedback on the proposed contract changes.
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
 *               isRecurring:
 *                 type: boolean
 *                 example: false
 *               recurrence:
 *                 type: object
 *                 properties:
 *                   frequency:
 *                     type: string
 *                     enum: [DAILY, WEEKLY, MONTHLY, NONE]
 *                     example: WEEKLY
 *                   nextOccurrence:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-10-27T10:00:00Z
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"), validateTaskPayload, createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: Call the client for follow up Updated
 *               description:
 *                 type: string
 *                 example: Update details.
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: MEDIUM
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *                 example: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put("/:id", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"), updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [08. Task Management]
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
 *         description: Task deleted successfully
 */
router.delete("/:id", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"), deleteTask);

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
 *                 example: COMPLETED
 *     responses:
 *       200:
 *         description: Task status updated successfully
 */
router.patch("/:id/status", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), updateTaskStatus);

/**
 * @swagger
 * /tasks/{id}/comments:
 *   post:
 *     summary: Add a comment to a task
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
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: I am working on this task now, will finish by evening.
 *     responses:
 *       200:
 *         description: Comment added successfully
 */
router.post("/:id/comments", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), addTaskComment);

/**
 * @swagger
 * /tasks/{id}/attachments:
 *   post:
 *     summary: Add an attachment to a task
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
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 example: specification_v2.pdf
 *               url:
 *                 type: string
 *                 example: https://res.cloudinary.com/crm/image/upload/spec.pdf
 *     responses:
 *       200:
 *         description: Attachment added successfully
 */
router.post("/:id/attachments", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), addTaskAttachment);

export default router;
