import { validateDesignationPayload } from "../validators/module.validators.js";
import express from "express";
import { 
  getDesignations, 
  getDesignationById, 
  createDesignation, 
  updateDesignation, 
  deleteDesignation 
} from "../controllers/designation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 03. User Management
 *   description: Designation Management APIs (Module 3 User Management)
 */

/**
 * @swagger
 * /designations:
 *   get:
 *     summary: Get all designations
 *     tags: [03. User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Designation list fetched successfully
 */
router.get(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  getDesignations
);

/**
 * @swagger
 * /designations/{id}:
 *   get:
 *     summary: Get designation by ID
 *     tags: [03. User Management]
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
 *         description: Designation details fetched successfully
 */
router.get(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  getDesignationById
);

/**
 * @swagger
 * /designations:
 *   post:
 *     summary: Create a new designation
 *     tags: [03. User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 example: DSG-001
 *               name:
 *                 type: string
 *                 example: Senior Software Engineer
 *               description:
 *                 type: string
 *                 example: Oversees core product development and mentors juniors.
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: Active
 *     responses:
 *       201:
 *         description: Designation created successfully
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  validateDesignationPayload,
  createDesignation
);

/**
 * @swagger
 * /designations/{id}:
 *   put:
 *     summary: Update an existing designation
 *     tags: [03. User Management]
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
 *               name:
 *                 type: string
 *                 example: Senior Software Engineer Updated
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Designation updated successfully
 */
router.put(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  validateDesignationPayload,
  updateDesignation
);

/**
 * @swagger
 * /designations/{id}:
 *   delete:
 *     summary: Delete a designation
 *     tags: [03. User Management]
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
 *         description: Designation deleted successfully
 */
router.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  deleteDesignation
);

export default router;
