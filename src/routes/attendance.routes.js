import { validateAttendancePayload } from "../validators/module.validators.js";
import express from "express";
import { 
  getAttendance, 
  getAttendanceById, 
  recordAttendance, 
  updateAttendance, 
  deleteAttendance 
} from "../controllers/attendance.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 03. User Management
 *   description: Attendance Management APIs (Module 3 / Operations)
 */

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get attendance records
 *     tags: [03. User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance records fetched successfully
 */
router.get(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  getAttendance
);

/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Get attendance record by ID
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
 *         description: Attendance record fetched successfully
 */
router.get(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  getAttendanceById
);

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Record/Upsert attendance for an employee
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
 *               - userId
 *               - date
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6511b0e2f9d3b80012345678
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-08-05
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-05T09:00:00.000Z
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-05T17:00:00.000Z
 *               status:
 *                 type: string
 *                 enum: [Present, Absent, Late, Half Day, On Leave]
 *                 example: Present
 *               notes:
 *                 type: string
 *                 example: Normal check-in.
 *     responses:
 *       200:
 *         description: Attendance recorded successfully
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  recordAttendance
);

/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Update attendance record
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
 *               status:
 *                 type: string
 *                 enum: [Present, Absent, Late, Half Day, On Leave]
 *                 example: Present
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-05T17:05:00.000Z
 *     responses:
 *       200:
 *         description: Attendance record updated successfully
 */
router.put(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  validateAttendancePayload,
  updateAttendance
);

/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Delete attendance record
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
 *         description: Attendance record deleted successfully
 */
router.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  deleteAttendance
);

export default router;
