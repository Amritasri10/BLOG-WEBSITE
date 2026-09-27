import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../controllers/blog/categoryController.js";
import { verifyJWT } from "../../middlewares/authMiddleware.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// ── Admin only ────────────────────────────────────────────────────────────────
router.post("/", verifyJWT, isAdmin, createCategory);
router.put("/:id", verifyJWT, isAdmin, updateCategory);
router.delete("/:id", verifyJWT, isAdmin, deleteCategory);

export default router;
