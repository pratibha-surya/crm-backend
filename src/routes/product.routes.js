import express from "express";
import { getProducts, createProduct } from "../controllers/product.controller.js";
import { validateProductPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "ACCOUNTANT"), getProducts);
router.post("/", authorizeRoles("SUPER_ADMIN", "COMPANY_ADMIN"), validateProductPayload, createProduct);

export default router;
