import express from "express";
import { requireAuth } from "@clerk/express";

import {
  createRFID,
  getAllRFID,
  getRFIDById,
  updateRFID,
  deleteRFID,
} from "../controllers/rfidController.js";

import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Create RFID
router.post(
  "/",
  requireAuth(),
  requireRole(["RFIDTagging", "admin", "SuperAdmin"]),
  createRFID,
);

// 🔹 Get All
router.get(
  "/",
  requireAuth(),
  requireRole(["RFIDTagging", "admin", "SuperAdmin"]),
  getAllRFID,
);

// 🔹 Get One
router.get(
  "/:id",
  requireAuth(),
  requireRole(["RFID Tagging Person", "admin"]),
  getRFIDById,
);

// 🔹 Update
router.put(
  "/:id",
  requireAuth(),
  requireRole(["RFID Tagging Person", "admin"]),
  updateRFID,
);

// 🔹 Delete
router.delete(
  "/:id",
  requireAuth(),
  requireRole(["admin", "SuperAdmin"]),
  deleteRFID,
);

export default router;
