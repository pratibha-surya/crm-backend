import express from "express";
import { getDeals, createDeal, updateDealStage } from "../controllers/deal.controller.js";
import { validateDealPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 06. Deal Management
 *   description: Track sales deals, stages, and projected revenue
 */

/**
 * @swagger
 * /deals:
 *   get:
 *     summary: Get all deals
 *     tags: [06. Deal Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deals retrieved successfully
 */
router.get("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), getDeals);

/**
 * @swagger
 * /deals:
 *   post:
 *     summary: Create a new deal
 *     tags: [06. Deal Management]
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
 *               - dealValue
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cloud Infrastructure Migration
 *               customerId:
 *                 type: string
 *                 example: 64f8c9d2e4b0a123456789ac
 *               leadId:
 *                 type: string
 *                 example: 64f8c9d2e4b0a123456789ad
 *               stage:
 *                 type: string
 *                 enum: [PROSPECT, QUALIFIED, MEETING, PROPOSAL, NEGOTIATION, WON, LOST]
 *                 example: PROSPECT
 *               dealValue:
 *                 type: number
 *                 example: 50000
 *               probability:
 *                 type: number
 *                 example: 50
 *               expectedClosingDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *               assignedTo:
 *                 type: string
 *                 example: 64f8c9d2e4b0a123456789ab
 *     responses:
 *       201:
 *         description: Deal created successfully
 */
router.post("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"), validateDealPayload, createDeal);

/**
 * @swagger
 * /deals/{id}/stage:
 *   patch:
 *     summary: Update deal stage
 *     tags: [06. Deal Management]
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
 *               - stage
 *             properties:
 *               stage:
 *                 type: string
 *                 enum: [PROSPECT, QUALIFIED, MEETING, PROPOSAL, NEGOTIATION, WON, LOST]
 *                 example: NEGOTIATION
 *     responses:
 *       200:
 *         description: Deal stage updated successfully
 */
router.patch("/:id/stage", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), updateDealStage);

export default router;
