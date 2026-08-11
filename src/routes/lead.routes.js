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
   importLeadsCSV,
   convertLeadToCustomer
} from "../controllers/lead.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";
import { validateLeadPayload } from "../validators/module.validators.js";

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
 *     description: "Retrieve a list of all records matching the authenticated context."
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Leads fetched successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Leads fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64f8c9d2e4b0a123456789ab"
 *                       title:
 *                         type: string
 *                         example: "Enterprise Software Requirement"
 *                       contactPerson:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+1234567890"
 *                       companyName:
 *                         type: string
 *                         example: "Tech Corp"
 *                       source:
 *                         type: string
 *                         example: "WEBSITE"
 *                       status:
 *                         type: string
 *                         example: "NEW"
 *                       leadScore:
 *                         type: number
 *                         example: 75
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
router.get("/", checkPermission("leads", "read"), getLeads);



/**
 * @swagger
 * /leads/export:
 *   get:
 *     summary: Export all leads to a CSV file
 *     description: "Execute operations matching capabilities."
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "CSV file download containing all leads"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "CSV file download containing all leads"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
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
router.get("/export", checkPermission("leads", "read"), exportLeadsCSV);

/**
 * @swagger
 * /leads/import:
 *   post:
 *     summary: Bulk import leads from CSV rows
 *     description: "Execute operations matching capabilities."
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
 *         description: "Leads imported successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Leads imported successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
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
router.post("/import", checkPermission("leads", "create"), importLeadsCSV);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Get lead details by ID
 *     description: "Retrieve detailed metadata for a single record matching the specified ID from path parameters."
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The unique Lead ID (e.g. 6a730f942011f9a488a4b4bb) - Do NOT put User ID here"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Lead details fetched successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead details fetched successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
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
 *         description: "Lead created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Lead created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f8c9d2e4b0a123456789ab"
 *                     title:
 *                       type: string
 *                       example: "Enterprise Software Requirement"
 *                     contactPerson:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     companyName:
 *                       type: string
 *                       example: "Tech Corp"
 *                     source:
 *                       type: string
 *                       example: "WEBSITE"
 *                     status:
 *                       type: string
 *                       example: "NEW"
 *                     leadScore:
 *                       type: number
 *                       example: 75
 *                     assignedTo:
 *                       type: string
 *                       example: "64f8c9d2e4b0a123456789ab"
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
router.post("/", checkPermission("leads", "create"), validateLeadPayload, createLead);

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     summary: Update an existing lead details
 *     description: "Retrieve detailed metadata for a single record matching the specified ID from path parameters."
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The unique Lead ID (e.g. 6a730f942011f9a488a4b4bb) - Do NOT put User ID here"
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
 *         description: "Lead updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead updated successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
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
router.put("/:id", checkPermission("leads", "update"), updateLead);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Delete a lead
 *     description: "Permanently delete the record matching the path parameter ID from the database."
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The unique Lead ID (e.g. 6a730f942011f9a488a4b4bb) - Do NOT put User ID here"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Lead deleted successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead deleted successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
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
router.delete("/:id", checkPermission("leads", "delete"), deleteLead);

/**
 * @swagger
 * /leads/{id}/status:
 *   patch:
 *     summary: Update lead status
 *     description: "Modify fields of the specified record matching the path parameter ID with the payload data."
 *     tags: [05. Lead Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "The unique Lead ID (e.g. 6a730f942011f9a488a4b4bb) - Do NOT put User ID here"
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
 *         description: "Lead status updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead status updated successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
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
 *                   example: "Authentication token invalid or expired."
 *       403:
 *         description: "Access denied - You are only allowed to update status for your assigned leads"
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
 *                   example: "Access denied: You are only allowed to update status for your assigned leads"
 *       404:
 *         description: "Lead not found"
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
 *                   example: "Lead not found"*/
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
 *         description: "The unique Lead ID (e.g. 6a730f942011f9a488a4b4bb) - Do NOT put User ID here"
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
 *         description: "Lead assigned successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead assigned successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
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
 *                   example: "Authentication token invalid or expired."
 *       403:
 *         description: "Access denied - You do not have permission to assign leads"
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
 *                   example: "Permission denied: Cannot update on leads"
 *       404:
 *         description: "Lead not found"
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
 *                   example: "Lead not found"*/
router.patch("/:id/assign", checkPermission("leads", "update"), assignLead);

/**
 * @swagger
 * /leads/{id}/convert-to-customer:
 *   post:
 *     summary: Convert a lead to a customer after its linked deal is won
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
 *       201:
 *         description: Lead converted to customer successfully
 */
router.post("/:id/convert-to-customer", checkPermission("customers", "create"), convertLeadToCustomer);

/**
 * @swagger
 * /leads/{id}/notes:
 *   post:
 *     summary: Add a note/comment to a lead
 *     description: "Instantiate and save a new record with the attributes specified in the request payload."
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
 *         description: "Note added successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Note added successfully"
 *                 data:
 *                   type: object
 *                   description: "Response payload data details."
 
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
router.post("/:id/notes", checkPermission("leads", "update"), addLeadNote);

export default router;
