import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", checkPermission("settings", "read"), getSettings);
router.put("/", checkPermission("settings", "update"), updateSettings);

export default router;
