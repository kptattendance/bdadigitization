import express from "express";
import { requireAuth } from "@clerk/express";

import {
  createOrGetUser,
  getAllUsers,
  getMyProfile,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/userController.js";

import { requireRole } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 🔹 Sync user on login
router.get("/sync", requireAuth(), createOrGetUser);
router.post(
  "/add",
  requireAuth(),
  // requireRole(["admin", "SuperAdmin"]),
  upload.single("image"),
  createUser,
);

// 🔹 Current user
router.get("/me", requireAuth(), getMyProfile);

// 🔹 admin routes
router.get(
  "/",
  requireAuth(),
  requireRole(["admin", "SuperAdmin"]),
  getAllUsers,
);

router.get("/:id", requireAuth(), requireRole(["admin"]), getUserById);

router.put(
  "/:id",
  requireAuth(),
  requireRole(["admin", "SuperAdmin"]),
  upload.single("image"), // 🔥 THIS IS THE FIX
  updateUser,
);

router.delete(
  "/:id",
  requireAuth(),
  //requireRole(["admin", "SuperAdmin"]),
  deleteUser,
);

export default router;
