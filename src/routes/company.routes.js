import express from "express";
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  updateCompanySubscription
} from "../controllers/company.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 03. Company Management
 *   description: Company setup, subscription control, and company profile management
 */

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags: [03. Company Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Companies fetched successfully
 */
router.get("/", checkPermission("companies", "read"), getCompanies);

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Register a new company in the CRM system
 *     tags: [03. Company Management]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Step 1 of the company setup flow.
 *       Create the company first, then register the Company Admin user using /auth/register.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acme CRM
 *               email:
 *                 type: string
 *                 example: info@acme.com
 *               phone:
 *                 type: string
 *                 example: +91 9876543210
 *               gstNumber:
 *                 type: string
 *                 example: 27AAAAA0000A1Z5
 *               panNumber:
 *                 type: string
 *                 example: ABCDE1234F
 *               website:
 *                 type: string
 *                 example: https://acme.com
 *               address:
 *                 type: object
 *                 example:
 *                   street: Main Road
 *                   city: Mumbai
 *                   state: MH
 *                   country: India
 *                   zipCode: "400001"
 *               subscription:
 *                 type: object
 *                 example:
 *                   plan: PRO
 *                   expiresAt: 2026-12-31T00:00:00.000Z
 *                   maxUsers: 50
 *     responses:
 *       201:
 *         description: Company created successfully
 */
router.post("/", checkPermission("companies", "create"), createCompany);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [03. Company Management]
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
 *         description: Company details fetched successfully
 */
router.get("/:id", checkPermission("companies", "read"), getCompanyById);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update company details
 *     tags: [03. Company Management]
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
 *         description: Company updated successfully
 */
router.put("/:id", checkPermission("companies", "update"), updateCompany);

/**
 * @swagger
 * /companies/{id}/subscription:
 *   patch:
 *     summary: Update company subscription plan
 *     tags: [03. Company Management]
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
 *         description: Company subscription updated successfully
 */
router.patch("/:id/subscription", checkPermission("companies", "update"), updateCompanySubscription);

export default router;
