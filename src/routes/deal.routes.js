import express from "express";
import { 
  getDeals, 
  createDeal, 
  updateDealStage,
  getDealById,
  updateDeal,
  deleteDeal,
  getSalesForecast
} from "../controllers/deal.controller.js";
import { validateDealPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 06. Deal Management
 *   description: Track sales deals, pipeline stages, expected closing, and sales forecast
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
 * /deals/forecast:
 *   get:
 *     summary: Get sales revenue forecast
 *     description: Aggregates active deals, grouping by stage, calculating projected values (dealValue * probability / 100), and yielding expected forecast metrics.
 *     tags: [06. Deal Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales forecast retrieved successfully
 */
router.get("/forecast", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"), getSalesForecast);

/**
 * @swagger
 * /deals/{id}:
 *   get:
 *     summary: Get deal details by ID
 *     tags: [06. Deal Management]
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
 *         description: Deal details retrieved successfully
 */
router.get("/:id", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE"), getDealById);

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
 * /deals/{id}:
 *   put:
 *     summary: Update an existing deal
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cloud Infrastructure Migration Updated
 *               dealValue:
 *                 type: number
 *                 example: 55000
 *               probability:
 *                 type: number
 *                 example: 75
 *               stage:
 *                 type: string
 *                 enum: [PROSPECT, QUALIFIED, MEETING, PROPOSAL, NEGOTIATION, WON, LOST]
 *                 example: PROPOSAL
 *     responses:
 *       200:
 *         description: Deal updated successfully
 */
router.put("/:id", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"), updateDeal);

/**
 * @swagger
 * /deals/{id}:
 *   delete:
 *     summary: Delete a deal
 *     tags: [06. Deal Management]
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
 *         description: Deal deleted successfully
 */
router.delete("/:id", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"), deleteDeal);

/**
 * @swagger
 * /deals/{id}/stage:
 *   patch:
 *     summary: Update deal stage (Kanban drag-and-drop)
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
