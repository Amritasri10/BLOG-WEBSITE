import { Router } from "express";
import {
  getAuthorDashboard,
  getAuthorPendingComments,
  getPublicAuthorProfile,
  getAllAuthors,
} from "../../controllers/blog/authorDashboardController.js";
import { verifyJWT, isAuthor } from "../../middlewares/authMiddleware.js";

const router = Router();

// ══ PUBLIC ════════════════════════════════════════════════════════════════════
router.get("/all", getAllAuthors);                          // sab authors ki list
router.get("/profile/:authorId", getPublicAuthorProfile);  // author ka public profile

// ══ AUTHOR only ═══════════════════════════════════════════════════════════════
router.get("/dashboard", verifyJWT, isAuthor, getAuthorDashboard);
router.get("/pending-comments", verifyJWT, isAuthor, getAuthorPendingComments);

export default router;
