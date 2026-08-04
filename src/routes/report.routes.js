import express from "express";
import { getReportsOverview, getSalesReport } from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/overview", checkPermission("reports", "read"), getReportsOverview);
router.get("/sales", checkPermission("reports", "read"), getSalesReport);

export default router;
