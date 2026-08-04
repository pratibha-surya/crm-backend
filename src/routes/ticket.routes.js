import express from "express";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  resolveTicket
} from "../controllers/ticket.controller.js";
import { validateTicketPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 13. Support Tickets
 *   description: Create, assign, update and resolve customer support tickets
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all support tickets
 *     tags: [13. Support Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tickets fetched successfully
 */
router.get(
  "/",
  checkPermission("tickets", "read"),
  getTickets
);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new support ticket
 *     tags: [13. Support Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - description
 *               - customer
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Login issue
 *               description:
 *                 type: string
 *                 example: Unable to login into CRM.
 *               customer:
 *                 type: string
 *                 example: 6890e0cf4baf761d12f76f8e
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                   - URGENT
 *                 example: HIGH
 *               assignedEmployee:
 *                 type: string
 *                 example: 6890e0cf4baf761d12f76f8e
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  checkPermission("tickets", "create"),
  validateTicketPayload,
  createTicket
);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [13. Support Tickets]
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
 *         description: Ticket fetched successfully
 *       404:
 *         description: Ticket not found
 */
router.get(
  "/:id",
  checkPermission("tickets", "read"),
  getTicketById
);

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Update support ticket
 *     tags: [13. Support Tickets]
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
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                   - URGENT
 *               status:
 *                 type: string
 *                 enum:
 *                   - OPEN
 *                   - IN_PROGRESS
 *                   - WAITING_FOR_CUSTOMER
 *                   - RESOLVED
 *                   - CLOSED
 *               assignedEmployee:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 */
router.put(
  "/:id",
  checkPermission("tickets", "update"),
  updateTicket
);

/**
 * @swagger
 * /tickets/{id}/resolve:
 *   patch:
 *     summary: Resolve support ticket
 *     tags: [13. Support Tickets]
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
 *         description: Ticket resolved successfully
 *       404:
 *         description: Ticket not found
 */
router.patch(
  "/:id/resolve",
  checkPermission("tickets", "resolve"),
  resolveTicket
);

export default router;