import express from "express";
import {
   getLeads,
   createLead,
   updateLeadStatus,
   assignLead,
   getLeadById,
   updateLead,
   deleteLead,
   addLeadNote,
   exportLeadsCSV,
   importLeadsCSV
} from "../controllers/lead.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 05. Lead Management
 *   description: Sales pipeline leads, opportunities, deal tracking, export/import, and lead notes (Module 5)
 */

/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Get all leads for the authenticated company
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leads fetched successfully
 */
router.get("/", checkPermission("leads", "read"), getLeads);

/**
 * @swagger
 * /leads/export:
 *   get:
 *     summary: Export all leads to a CSV file
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download containing all leads
 */
router.get("/export", checkPermission("leads", "read"), exportLeadsCSV);

/**
 * @swagger
 * /leads/import:
 *   post:
 *     summary: Bulk import leads from CSV rows
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leads
 *             properties:
 *               leads:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     contactPerson:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     source:
 *                       type: string
 *                       enum: [WEBSITE, FACEBOOK, GOOGLE_ADS, REFERRAL, COLD_CALL, WALK_IN, IMPORT, OTHER]
 *                 example: [{"title": "Web Inquiry", "contactPerson": "Alice", "email": "alice@site.com", "source": "WEBSITE"}]
 *     responses:
 *       201:
 *         description: Leads imported successfully
 */
router.post("/import", checkPermission("leads", "create"), importLeadsCSV);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Get lead details by ID
 *     tags: [05. Lead Management]
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
 *         description: Lead details fetched successfully
 */
router.get("/:id", checkPermission("leads", "read"), getLeadById);

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead/opportunity
 *     tags: [05. Lead Management]
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
 *               - contactPerson
 *             properties:
 *               title:
 *                 type: string
 *                 example: Enterprise Software Requirement
 *               contactPerson:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               companyName:
 *                 type: string
 *                 example: Tech Corp
 *               source:
 *                 type: string
 *                 enum: [WEBSITE, FACEBOOK, GOOGLE_ADS, REFERRAL, COLD_CALL, WALK_IN, IMPORT, OTHER]
 *                 example: WEBSITE
 *               status:
 *                 type: string
 *                 enum: [NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST]
 *                 example: NEW
 *               leadScore:
 *                 type: number
 *                 example: 75
 *               assignedTo:
 *                 type: string
 *                 description: User ID of the sales rep assigned
 *                 example: 64f8c9d2e4b0a123456789ab
 *     responses:
 *       201:
 *         description: Lead created successfully
 */
router.post("/", checkPermission("leads", "create"), createLead);

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     summary: Update an existing lead details
 *     tags: [05. Lead Management]
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
 *                 example: Enterprise Software Requirement Updated
 *               contactPerson:
 *                 type: string
 *                 example: John Doe
 *               leadScore:
 *                 type: number
 *                 example: 85
 *     responses:
 *       200:
 *         description: Lead updated successfully
 */
router.put("/:id", checkPermission("leads", "update"), updateLead);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Delete a lead
 *     tags: [05. Lead Management]
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
 *         description: Lead deleted successfully
 */
router.delete("/:id", checkPermission("leads", "delete"), deleteLead);

/**
 * @swagger
 * /leads/{id}/status:
 *   patch:
 *     summary: Update lead status
 *     tags: [05. Lead Management]
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
 *                 enum: [NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST]
 *                 example: QUALIFIED
 *     responses:
 *       200:
 *         description: Lead status updated successfully
 */
router.patch("/:id/status", checkPermission("leads", "update"), updateLeadStatus);

/**
 * @swagger
 * /leads/{id}/assign:
 *   patch:
 *     summary: Assign lead to a user
 *     tags: [05. Lead Management]
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user (e.g. Sales Executive) to assign this lead to
 *                 example: 64f8c9d2e4b0a123456789ab
 *     responses:
 *       200:
 *         description: Lead assigned successfully
 */
router.patch("/:id/assign", checkPermission("leads", "update"), assignLead);

/**
 * @swagger
 * /leads/{id}/notes:
 *   post:
 *     summary: Add a note/comment to a lead
 *     tags: [05. Lead Management]
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
 *                 example: Talked to John. They are interested in a 3-year enterprise license.
 *     responses:
 *       200:
 *         description: Note added successfully
 */
router.post("/:id/notes", checkPermission("leads", "update"), addLeadNote);

export default router;
