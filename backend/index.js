import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Routes
import authRoutes from "./router/authRoutes.js";
import userRoutes from "./router/userRoutes.js";
import blogRoutes from "./router/blog/blogRoutes.js";
import commentRoutes from "./router/blog/commentRoutes.js";
import categoryRoutes from "./router/blog/categoryRoutes.js";
import authorDashboardRoutes from "./router/blog/authorDashboardRoutes.js";
import adminDashboardRoutes from "./router/blog/adminDashboardRoutes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);              // User / Author / Admin auth
app.use("/api/user", userRoutes);              // Reader — saved, liked, follow
app.use("/api/blogs", blogRoutes);             // Blog CRUD
app.use("/api/comments", commentRoutes);       // Comments
app.use("/api/categories", categoryRoutes);    // Categories
app.use("/api/authors", authorDashboardRoutes); // Author dashboard + public profiles
app.use("/api/admin", adminDashboardRoutes);   // Admin dashboard

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
