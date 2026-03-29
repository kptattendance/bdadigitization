import User from "../models/User.js";
import { getAuth } from "@clerk/express";

export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { userId } = getAuth(req);
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ✅ FIXED HERE
      const hasRole = allowedRoles.includes(user.role);
      if (!hasRole) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.dbUser = user;
      next();
    } catch (err) {
      console.error("ROLE ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  };
};
