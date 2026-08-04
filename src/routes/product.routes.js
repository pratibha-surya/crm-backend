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
 *               companyId:
 *                 type: string
 *                 example: 64f8c9d2e4b0a123456789ab
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
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  validateProductPayload,
  createProduct
);

export default router;