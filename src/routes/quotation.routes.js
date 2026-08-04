import express from "express";
import {
  getQuotations,
  createQuotation,
  updateQuotationStatus
} from "../controllers/quotation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", checkPermission("quotations", "read"), getQuotations);
router.post("/", checkPermission("quotations", "create"), createQuotation);
router.patch("/:id/status", checkPermission("quotations", "update"), updateQuotationStatus);

export default router;
