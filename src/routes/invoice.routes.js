import express from "express";
import {
  getInvoices,
  createInvoice,
  updatePaymentStatus
} from "../controllers/invoice.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", checkPermission("invoices", "read"), getInvoices);
router.post("/", checkPermission("invoices", "create"), createInvoice);
router.patch("/:id/payment", checkPermission("invoices", "update"), updatePaymentStatus);

export default router;
