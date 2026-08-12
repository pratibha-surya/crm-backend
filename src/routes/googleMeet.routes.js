import express from "express";
import { finishGoogleConnection, startGoogleConnection } from "../controllers/googleMeet.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/authorize", protect, startGoogleConnection);
router.get("/callback", finishGoogleConnection);

export default router;
