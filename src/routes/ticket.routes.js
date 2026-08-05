import express from "express";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  resolveTicket,
  closeTicket,
  addTicketReply,
  addTicketAttachment
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
 *   description: Create, assign, update, close, and reply to customer support tickets (Module 13)
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
router.get("/", checkPermission("tickets", "read"), getTickets);

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
 *               - customerId
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Login issue
 *               description:
 *                 type: string
 *                 example: Unable to login into CRM.
 *               customerId:
 *                 type: string
 *                 example: 6890e0cf4baf761d12f76f8e
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 example: HIGH
 *               assignedTo:
 *                 type: string
 *                 example: 6890e0cf4baf761d12f76f8e
 *     responses:
 *       201:
 *         description: Ticket created successfully
 */
router.post("/", checkPermission("tickets", "create"), validateTicketPayload, createTicket);

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
 */
router.get("/:id", checkPermission("tickets", "read"), getTicketById);

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Update support ticket details
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
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED]
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 */
router.put("/:id", checkPermission("tickets", "update"), updateTicket);

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
 */
router.patch("/:id/resolve", checkPermission("tickets", "resolve"), resolveTicket);

/**
 * @swagger
 * /tickets/{id}/close:
 *   patch:
 *     summary: Close support ticket
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
 *         description: Ticket closed successfully
 */
router.patch("/:id/close", checkPermission("tickets", "resolve"), closeTicket);

/**
 * @swagger
 * /tickets/{id}/replies:
 *   post:
 *     summary: Submit a reply to a support ticket
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
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: Hello, please try resetting your browser cookies and check again.
 *     responses:
 *       200:
 *         description: Reply added successfully
 */
router.post("/:id/replies", checkPermission("tickets", "update"), addTicketReply);

/**
 * @swagger
 * /tickets/{id}/attachments:
 *   post:
 *     summary: Add an attachment to a support ticket
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
 *             required:
 *               - name
 *               - url
 *             properties:
 *               name:
 *                 type: string
 *                 example: error_screenshot.png
 *               url:
 *                 type: string
 *                 example: https://res.cloudinary.com/support/image/upload/err.png
 *     responses:
 *       200:
 *         description: Attachment added successfully
 */
router.post("/:id/attachments", checkPermission("tickets", "update"), addTicketAttachment);

export default router;