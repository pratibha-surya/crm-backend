import express from "express";
import {
  getLeads,
  createLead,
  updateLeadStatus
} from "../controllers/lead.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", checkPermission("leads", "read"), getLeads);
router.post("/", checkPermission("leads", "create"), createLead);
router.patch("/:id/status", checkPermission("leads", "update"), updateLeadStatus);

export default router;
