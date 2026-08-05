import express from "express";
import { 
  getProducts, 
  createProduct, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from "../controllers/product.controller.js";
import { validateProductPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: 11. Product Management
 *   description: Product Management APIs (Module 11)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Fetch list of products belonging to the logged-in company.
 *     tags: [11. Product Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Products fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6511b0e2f9d3b80012345678
 *                       companyId:
 *                         type: string
 *                         example: 000000000000000000000000
 *                       name:
 *                         type: string
 *                         example: HP Laptop ProBook
 *                       sku:
 *                         type: string
 *                         example: HP-PB-001
 *                       category:
 *                         type: string
 *                         example: Electronics
 *                       unit:
 *                         type: string
 *                         example: pcs
 *                       tax:
 *                         type: number
 *                         example: 18
 *                       price:
 *                         type: number
 *                         example: 55000
 *                       cost:
 *                         type: number
 *                         example: 48000
 *                       stock:
 *                         type: number
 *                         example: 50
 *                       barcode:
 *                         type: string
 *                         example: 8901234567890
 *                       image:
 *                         type: string
 *                         example: https://via.placeholder.com/150
 *                       isActive:
 *                         type: boolean
 *                         example: true
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
 *     description: Creates a new product for the company. If companyId is not supplied or user does not have one attached, a fallback ID is automatically assigned.
 *     tags: [11. Product Management]
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
 *                 example: "000000000000000000000000"
 *               name:
 *                 type: string
 *                 example: HP Laptop ProBook
 *               sku:
 *                 type: string
 *                 example: HP-PB-001
 *               category:
 *                 type: string
 *                 example: Electronics
 *               unit:
 *                 type: string
 *                 example: pcs
 *               tax:
 *                 type: number
 *                 example: 18
 *               price:
 *                 type: number
 *                 example: 55000
 *               cost:
 *                 type: number
 *                 example: 48000
 *               stock:
 *                 type: number
 *                 example: 50
 *               barcode:
 *                 type: string
 *                 example: "8901234567890"
 *               image:
 *                 type: string
 *                 example: https://via.placeholder.com/150
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error (e.g. missing name, sku, or price)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  validateProductPayload,
  createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Fetch detailed information of a single product by its ObjectId.
 *     tags: [11. Product Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details fetched successfully
 *       404:
 *         description: Product not found
 */
router.get(
  "/:id",
  authorizeRoles(
    "SUPER_ADMIN",
    "COMPANY_ADMIN",
    "SALES_MANAGER",
    "SALES_EXECUTIVE",
    "ACCOUNTANT"
  ),
  getProductById
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Update product information such as price, stock, SKU, or category.
 *     tags: [11. Product Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: HP Laptop ProBook Updated
 *               price:
 *                 type: number
 *                 example: 58000
 *               stock:
 *                 type: number
 *                 example: 75
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER"),
  updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Remove a product from the database.
 *     tags: [11. Product Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  deleteProduct
);

export default router;