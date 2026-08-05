import { validateDepartmentPayload } from "../validators/module.validators.js";
import express from "express";
import { 
  getDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from "../controllers/department.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 03. User Management
 *   description: Department Management APIs (Module 3 User Management)
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [03. User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department list fetched successfully
 */
router.get(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  getDepartments
);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
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
 *         description: Department details fetched successfully
 */
router.get(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  getDepartmentById
);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
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
 *               branchId:
 *                 type: string
 *                 example: 6511b0e2f9d3b80012345678
 *               code:
 *                 type: string
 *                 example: DEP-001
 *               name:
 *                 type: string
 *                 example: Human Resources (HR)
 *               head:
 *                 type: string
 *                 example: Anish Sharma
 *               description:
 *                 type: string
 *                 example: Handles employee onboarding, benefits, and workplace culture.
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: Active
 *     responses:
 *       201:
 *         description: Department created successfully
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  validateDepartmentPayload,
  createDepartment
);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update an existing department
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
 *                 example: Human Resources (HR) Updated
 *               head:
 *                 type: string
 *                 example: Rajesh Sharma
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Department updated successfully
 */
router.put(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  validateDepartmentPayload,
  updateDepartment
);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department
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
 *         description: Department deleted successfully
 */
router.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  deleteDepartment
);

export default router;
