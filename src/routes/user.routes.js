import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Employee CRUD & User account management (Requires authentication & permission)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users/employees
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users fetched successfully
 *       403:
 *         description: Permission denied
 */
router.get("/", checkPermission("users", "read"), getUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new employee account with specified role
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Sales
 *               lastName:
 *                 type: string
 *                 example: Executive
 *               email:
 *                 type: string
 *                 example: sales.exec@company.com
 *               password:
 *                 type: string
 *                 example: SecurePass123!
 *               role:
 *                 type: string
 *                 enum: [SALES_MANAGER, SALES_EXECUTIVE, CUSTOMER_SUPPORT, ACCOUNTANT, COMPANY_ADMIN]
 *                 example: SALES_EXECUTIVE
 *     responses:
 *       201:
 *         description: Employee account created successfully
 *       403:
 *         description: Permission denied
 */
router.post("/", checkPermission("users", "create"), createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get single user details
 *     tags: [User Management]
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
 *         description: User details retrieved
 */
router.get("/:id", checkPermission("users", "read"), getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [User Management]
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
 *         description: User updated successfully
 */
router.put("/:id", checkPermission("users", "update"), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Soft delete user record
 *     tags: [User Management]
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
 *         description: User deleted successfully
 */
router.delete("/:id", checkPermission("users", "delete"), deleteUser);

export default router;
