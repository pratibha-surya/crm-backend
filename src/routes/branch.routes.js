import { validateBranchPayload } from "../validators/module.validators.js";
import express from "express";
import { 
  getBranches, 
  getBranchById, 
  createBranch, 
  updateBranch, 
  deleteBranch 
} from "../controllers/branch.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 03. User Management
 *   description: Branch Management APIs (Module 19 Settings)
 */

/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Get all branches
 *     tags: [03. User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Branch list fetched successfully
 */
router.get(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  getBranches
);

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Get branch by ID
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
 *         description: Branch details fetched successfully
 */
router.get(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  getBranchById
);

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Register a new branch
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
 *               - city
 *             properties:
 *               code:
 *                 type: string
 *                 example: BR-001
 *               name:
 *                 type: string
 *                 example: Downtown HQ Branch
 *               manager:
 *                 type: string
 *                 example: Suresh Raina
 *               city:
 *                 type: string
 *                 example: New York
 *               phone:
 *                 type: string
 *                 example: +1 212-555-0144
 *               email:
 *                 type: string
 *                 example: hq@company.com
 *               address:
 *                 type: string
 *                 example: 123 Broadway, NY
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: Active
 *     responses:
 *       201:
 *         description: Branch registered successfully
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  validateBranchPayload,
  createBranch
);

/**
 * @swagger
 * /branches/{id}:
 *   put:
 *     summary: Update an existing branch
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
 *                 example: Downtown HQ Branch Updated
 *               manager:
 *                 type: string
 *                 example: Suresh Raina
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Branch updated successfully
 */
router.put(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  validateBranchPayload,
  updateBranch
);

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Delete a branch
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
 *         description: Branch deleted successfully
 */
router.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  deleteBranch
);

export default router;
