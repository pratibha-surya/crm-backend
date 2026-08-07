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
 *   name: 20. Role & Permission
 *   description: Role and permission management for RBAC enforcement
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     description: "Retrieve a list of all records matching the authenticated context."
 *     tags: [20. Role & Permission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
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
 *         description: Unauthorized
 */
router.get("/", protect, checkPermission("roles", "read"), getRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a role with permissions
 *     description: "Instantiate and save a new record with the attributes specified in the request payload."
 *     tags: [20. Role & Permission]
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
 *                   example: "Role created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f8c9d2e4b0a123456789ab"
 *                     name:
 *                       type: string
 *                       example: "SALES_MANAGER"
 *                     description:
 *                       type: string
 *                       example: "Handles lead and deal assignments"
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["leads:create", "leads:read", "deals:create"]
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
 *         description: Permission denied
 */
router.post("/", protect, checkPermission("roles", "create"), createRole);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role
 *     description: "Modify fields of the specified record matching the path parameter ID with the payload data."
 *     tags: [20. Role & Permission]
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
 *         description: Permission denied
 */
router.put("/:id", protect, checkPermission("roles", "update"), updateRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     description: "Permanently delete the record matching the path parameter ID from the database."
 *     tags: [20. Role & Permission]
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
 *         description: Permission denied
 */
router.delete("/:id", protect, checkPermission("roles", "delete"), deleteRole);

export default router;
