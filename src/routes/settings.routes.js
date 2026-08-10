import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 19. Settings
 *   description: Company settings, SMTP, API Keys, Theme, Invoice Settings
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get company settings
 *     description: "Execute operations matching capabilities."
 *     tags: [19. Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: CRM Pro Pvt Ltd
 *                     logo:
 *                       type: string
 *                       example: https://example.com/logo.png
 *                     gstNumber:
 *                       type: string
 *                       example: 23ABCDE1234F1Z5
 *                     email:
 *                       type: string
 *                       example: info@crmpro.com
 *                     phone:
 *                       type: string
 *                       example: +919876543210
 *                 currency:
 *                   type: string
 *                   example: INR
 *                 timezone:
 *                   type: string
 *                   example: Asia/Kolkata
 *                 language:
 *                   type: string
 *                   example: en
 *                 theme:
 *                   type: string
 *                   example: light
 
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
  checkPermission("settings", "read"),
  getSettings
);

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update company settings
 *     description: "Modify fields of the specified record matching the path parameter ID with the payload data."
 *     tags: [19. Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: CRM Pro Pvt Ltd
 *                   logo:
 *                     type: string
 *                     example: https://example.com/logo.png
 *                   gstNumber:
 *                     type: string
 *                     example: 23ABCDE1234F1Z5
 *                   email:
 *                     type: string
 *                     example: info@crmpro.com
 *                   phone:
 *                     type: string
 *                     example: +919876543210
 *                   website:
 *                     type: string
 *                     example: https://crmpro.com
 *                   address:
 *                     type: string
 *                     example: Indore, Madhya Pradesh
 *               currency:
 *                 type: string
 *                 example: INR
 *               timezone:
 *                 type: string
 *                 example: Asia/Kolkata
 *               language:
 *                 type: string
 *                 example: en
 *               theme:
 *                 type: string
 *                 example: dark
 *               smtp:
 *                 type: object
 *                 properties:
 *                   host:
 *                     type: string
 *                     example: smtp.gmail.com
 *                   port:
 *                     type: integer
 *                     example: 587
 *                   secure:
 *                     type: boolean
 *                     example: false
 *                   user:
 *                     type: string
 *                     example: admin@gmail.com
 *                   pass:
 *                     type: string
 *                     example: app-password
 *                   fromEmail:
 *                     type: string
 *                     example: noreply@crmpro.com
 *                   fromName:
 *                     type: string
 *                     example: CRM Pro
 *               apiKeys:
 *                 type: object
 *                 properties:
 *                   imageKitPublicKey:
 *                     type: string
 *                   imageKitPrivateKey:
 *                     type: string
 *                   imageKitUrlEndpoint:
 *                     type: string
 *                   razorpayKeyId:
 *                     type: string
 *                   razorpayKeySecret:
 *                     type: string
 *               invoice:
 *                 type: object
 *                 properties:
 *                   prefix:
 *                     type: string
 *                     example: INV-
 *                   startingNumber:
 *                     type: integer
 *                     example: 1001
 *                   terms:
 *                     type: string
 *                     example: Payment due within 30 days.
 *                   notes:
 *                     type: string
 *                     example: Thank you for your business.
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/",
  checkPermission("settings", "update"),
  updateSettings
);

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

/**
 * @swagger
 * /settings/upload-logo:
 *   post:
 *     summary: Upload company logo
 *     description: Uploads a company logo to ImageKit and saves the URL in settings
 *     tags: [19. Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 */
router.post(
  "/upload-logo",
  checkPermission("settings", "update"),
  upload.single("file"),
  (req, res, next) => import("../controllers/settings.controller.js").then(m => m.uploadLogo(req, res, next)).catch(next)
);

export default router;