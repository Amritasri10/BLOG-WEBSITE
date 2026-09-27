import { Router } from "express";
import {
  getCommentsByBlog,
  addComment,
  updateComment,
  deleteComment,
} from "../../controllers/blog/commentController.js";
import { verifyJWT } from "../../middlewares/authMiddleware.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/:blogId", getCommentsByBlog);

// ── Protected ─────────────────────────────────────────────────────────────────
router.post("/:blogId", verifyJWT, addComment);
router.patch("/:id", verifyJWT, updateComment);
router.delete("/:id", verifyJWT, deleteComment);

export default router;
