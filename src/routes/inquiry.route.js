import express from "express";
import {
  getInquiries,
  getInquiryById,
  createInquiry,
  verifyOTP,
  addMessage,
  deleteInquiry
} from "../controllers/inquiry.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 21. Inquiries & Chat
 *   description: Customer chat widget inquiries, OTP verification, messaging, and inquiry management
 */

/**
 * @swagger
 * /inquiries:
 *   post:
 *     summary: Create a new customer inquiry / start chat session
 *     description: Initiates a customer inquiry session and generates a 6-digit verification OTP.
 *     tags: [21. Inquiries & Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mobile
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               mobile:
 *                 type: string
 *                 example: "+919876543210"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               message:
 *                 type: string
 *                 example: "Hello, I need help with my account."
 *     responses:
 *       201:
 *         description: Inquiry initiated and OTP generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 210
 *                 message:
 *                   type: string
 *                   example: "Inquiry initiated. OTP generated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f8c9d2e4b0a123456789ab"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     mobile:
 *                       type: string
 *                       example: "+919876543210"
 *                     email:
 *                       type: string
 *                       example: "jane.doe@example.com"
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                             example: "user"
 *                           text:
 *                             type: string
 *                             example: "Hello, I need help with my account."
 *       400:
 *         description: Validation Error (Missing required fields).
 *       409:
 *         description: Conflict (Duplicate active session or pending verification if applicable).
 */
router.post("/", createInquiry);

/**
 * @swagger
 * /inquiries/{id}/verify:
 *   post:
 *     summary: Verify OTP for an inquiry session
 *     description: Verifies the 6-digit OTP sent to the user to activate the inquiry chat.
 *     tags: [21. Inquiries & Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully or inquiry already verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f8c9d2e4b0a123456789ab"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     mobile:
 *                       type: string
 *                       example: "+919876543210"
 *                     email:
 *                       type: string
 *                       example: "jane.doe@example.com"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid or expired OTP.
 *       404:
 *         description: Inquiry session not found.
 */
router.post("/:id/verify", verifyOTP);

/**
 * @swagger
 * /inquiries/{id}/messages:
 *   post:
 *     summary: Add a message to an inquiry chat session
 *     description: Appends a message from the user or model (AI) agent to the chat history.
 *     tags: [21. Inquiries & Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - text
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, model]
 *                 example: "user"
 *               text:
 *                 type: string
 *                 example: "I would like to purchase the Premium plan."
 *     responses:
 *       200:
 *         description: Message added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Message added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f8c9d2e4b0a123456789ab"
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                             example: "user"
 *                           text:
 *                             type: string
 *                             example: "I would like to purchase the Premium plan."
 *       400:
 *         description: Invalid role or missing content.
 *       404:
 *         description: Inquiry session not found.
 */
router.post("/:id/messages", addMessage);

/**
 * @swagger
 * /inquiries:
 *   get:
 *     summary: Get all inquiries
 *     description: Retrieves all inquiries in the system (Protected - Admins / Agents).
 *     tags: [21. Inquiries & Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inquiries fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Inquiries fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64f8c9d2e4b0a123456789ab"
 *                       name:
 *                         type: string
 *                         example: "Jane Doe"
 *                       email:
 *                         type: string
 *                         example: "jane.doe@example.com"
 *       401:
 *         description: Unauthorized.
 */
router.get("/", protect, getInquiries);

/**
 * @swagger
 * /inquiries/{id}:
 *   get:
 *     summary: Get inquiry details by ID
 *     description: Retrieves details of a specific inquiry session (Protected - Admins / Agents).
 *     tags: [21. Inquiries & Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inquiry ID
 *     responses:
 *       200:
 *         description: Inquiry details fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Inquiry details fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f8c9d2e4b0a123456789ab"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Inquiry not found.
 */
router.get("/:id", protect, getInquiryById);

/**
 * @swagger
 * /inquiries/{id}:
 *   delete:
 *     summary: Delete an inquiry session
 *     description: Removes an inquiry record from the system (Protected - Admins / Agents).
 *     tags: [21. Inquiries & Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The inquiry ID
 *     responses:
 *       200:
 *         description: Inquiry deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Inquiry deleted successfully"
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Inquiry not found.
 */
router.delete("/:id", protect, deleteInquiry);

export default router;
