import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../controllers/customer.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";
import { validateCustomerPayload } from "../validators/module.validators.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 04. Customer Management
 *   description: Customer profile, contact details, and lifecycle management
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers for the authenticated company
 *     tags: [04. Customer Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers fetched successfully
 */
router.get("/", checkPermission("customers", "read"), getCustomers);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [04. Customer Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - companyName
 *               - contactPerson
 *               - email
 *               - phone
 *             properties:
 *               companyId:
 *                 type: string
 *                 example: 64f8c9d2e4b0a123456789ab
 *               companyName:
 *                 type: string
 *                 example: Acme Industries
 *               contactPerson:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 example: rahul@acme.com
 *               phone:
 *                 type: string
 *                 example: +91 9876543210
 *               gstNumber:
 *                 type: string
 *                 example: 27AAAAA0000A1Z5
 *               panNumber:
 *                 type: string
 *                 example: ABCDE1234F
 *               industry:
 *                 type: string
 *                 example: Manufacturing
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["vip", "import"]
 *               address:
 *                 type: object
 *                 example:
 *                   street: Corporate Avenue
 *                   city: Mumbai
 *                   state: MH
 *                   country: India
 *                   zipCode: "400001"
 *     responses:
 *       201:
 *         description: Customer created successfully
 */
router.post("/", checkPermission("customers", "create"), validateCustomerPayload, createCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [04. Customer Management]
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
 *         description: Customer details fetched successfully
 */
router.get("/:id", checkPermission("customers", "read"), getCustomerById);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update customer details
 *     tags: [04. Customer Management]
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
 *         description: Customer updated successfully
 */
router.put("/:id", checkPermission("customers", "update"), updateCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete customer
 *     tags: [04. Customer Management]
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
 *         description: Customer deleted successfully
 */
router.delete("/:id", checkPermission("customers", "delete"), deleteCustomer);

export default router;
