import express from "express";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole
} from "../controllers/role.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 02. Role & Permission
 *   description: Role and permission management for RBAC enforcement
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, checkPermission("roles", "read"), getRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a role with permissions
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sales Manager
 *               code:
 *                 type: string
 *                 example: SALES_MANAGER
 *               description:
 *                 type: string
 *                 example: Handles lead and deal assignments
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["leads:create", "leads:read", "deals:create"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *       403:
 *         description: Permission denied
 */
router.post("/", protect, checkPermission("roles", "create"), createRole);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
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
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       403:
 *         description: Permission denied
 */
router.put("/:id", protect, checkPermission("roles", "update"), updateRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
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
 *         description: Role deleted successfully
 *       403:
 *         description: Permission denied
 */
router.delete("/:id", protect, checkPermission("roles", "delete"), deleteRole);

export default router;
