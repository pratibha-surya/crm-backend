import express from "express";
import { getProducts, createProduct } from "../controllers/product.controller.js";
import { validateProductPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Management APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   companyId:
 *                     type: string
 *                     example: 6890e0cf4baf761d12f76f8e
 *                   name:
 *                     type: string
 *                     example: HP Laptop
 *                   sku:
 *                     type: string
 *                     example: HP-001
 *                   category:
 *                     type: string
 *                     example: Electronics
 *                   price:
 *                     type: number
 *                     example: 55000
 *                   cost:
 *                     type: number
 *                     example: 48000
 *                   stock:
 *                     type: number
 *                     example: 100
 *                   isActive:
 *                     type: boolean
 *                     example: true
 */
router.get(
  "/",
  authorizeRoles(
    "SUPER_ADMIN",
    "COMPANY_ADMIN",
    "SALES_MANAGER",
    "SALES_EXECUTIVE",
    "ACCOUNTANT"
  ),
  getProducts
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product for the authenticated company. The companyId is automatically taken from the logged-in user.
 *     tags: [Products]
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
 *               - sku
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: HP Laptop
 *               sku:
 *                 type: string
 *                 example: HP-001
 *               category:
 *                 type: string
 *                 example: Electronics
 *               price:
 *                 type: number
 *                 example: 55000
 *               cost:
 *                 type: number
 *                 example: 48000
 *               stock:
 *                 type: number
 *                 example: 100
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  validateProductPayload,
 createProduct
);

export default router;