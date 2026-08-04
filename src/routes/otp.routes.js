import express from "express";
import { handleSendOTP, handleVerifyOTP } from "../controllers/otp.controller.js";

const router = express.Router();

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to user email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               purpose:
 *                 type: string
 *                 enum: [REGISTRATION, FORGOT_PASSWORD, 2FA]
 *                 default: REGISTRATION
 *     responses:
 *       200:
 *         description: OTP generated and sent successfully
 */
router.post("/send-otp", handleSendOTP);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               purpose:
 *                 type: string
 *                 enum: [REGISTRATION, FORGOT_PASSWORD, 2FA]
 *                 default: REGISTRATION
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", handleVerifyOTP);

export default router;
