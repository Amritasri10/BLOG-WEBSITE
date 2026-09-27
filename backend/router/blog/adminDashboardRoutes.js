import { Router } from "express";
import { getDashboardStats } from "../../controllers/blog/adminDashboardController.js";
import { verifyJWT } from "../../middlewares/authMiddleware.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = Router();

// ── Admin only ────────────────────────────────────────────────────────────────
router.get("/stats", verifyJWT, isAdmin, getDashboardStats);

export default router;
