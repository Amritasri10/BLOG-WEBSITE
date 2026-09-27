import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Auth
import authRoutes from "./router/authRoutes.js";

// Blog Routes
import blogRoutes from "./router/blog/blogRoutes.js";
import commentRoutes from "./router/blog/commentRoutes.js";
import categoryRoutes from "./router/blog/categoryRoutes.js";
import adminDashboardRoutes from "./router/blog/adminDashboardRoutes.js";

dotenv.config();

const app = express();

const clientUrl = process.env.CLIENT_URL;

app.use(
  cors({
    origin: clientUrl || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Auth ──────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Blog ──────────────────────────────────────────────────────────────────────
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
