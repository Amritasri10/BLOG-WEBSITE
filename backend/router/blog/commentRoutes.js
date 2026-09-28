import { Router } from "express";
import {
  getCommentsByBlog,
  addComment,
  updateComment,
  deleteComment,
  approveComment,
} from "../../controllers/blog/commentController.js";
import { verifyJWT } from "../../middlewares/authMiddleware.js";

const router = Router();

// ══ PUBLIC ════════════════════════════════════════════════════════════════════
router.get("/:blogId", getCommentsByBlog);        // sirf approved comments

// ══ USER / AUTHOR (logged-in) ═════════════════════════════════════════════════
router.post("/:blogId", verifyJWT, addComment);   // comment karo
router.patch("/:id", verifyJWT, updateComment);   // apna comment edit karo

// ══ USER (apna) + AUTHOR (apne blog ka) + ADMIN (sab) ════════════════════════
router.delete("/:id", verifyJWT, deleteComment);

// ══ AUTHOR (apne blog ke comments) + ADMIN ════════════════════════════════════
router.patch("/:id/approve", verifyJWT, approveComment);

export default router;
