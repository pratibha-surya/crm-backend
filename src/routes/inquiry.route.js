import express from "express";
import {
  getInquiries,
  getInquiryById,
  createInquiry,
  verifyOTP,
  addMessage,
  deleteInquiry
} from "../controllers/inquiry.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes (for customer-facing chatbot/widget integration)
router.post("/", createInquiry);
router.post("/:id/verify", verifyOTP);
router.post("/:id/messages", addMessage);

// Protected routes (for CRM Admins / Agents)
router.get("/", protect, getInquiries);
router.get("/:id", protect, getInquiryById);
router.delete("/:id", protect, deleteInquiry);

export default router;
