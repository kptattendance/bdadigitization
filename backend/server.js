import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import rfidRoutes from "./routes/rfidRoutes.js";

import { clerkMiddleware } from "@clerk/express";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

// Public route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/rfid", rfidRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
