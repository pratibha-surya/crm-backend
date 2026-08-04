import express from "express";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  resolveTicket
} from "../controllers/ticket.controller.js";
import { validateTicketPayload } from "../validators/module.validators.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", checkPermission("tickets", "read"), getTickets);
router.post("/", checkPermission("tickets", "create"), validateTicketPayload, createTicket);
router.get("/:id", checkPermission("tickets", "read"), getTicketById);
router.put("/:id", checkPermission("tickets", "update"), updateTicket);
router.patch("/:id/resolve", checkPermission("tickets", "resolve"), resolveTicket);

export default router;
