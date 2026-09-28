import { Router } from "express";
import {
  getSavedBlogs,
  getLikedBlogs,
  toggleFollowAuthor,
  getFollowingAuthors,
} from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// ══ USER (logged-in) ══════════════════════════════════════════════════════════
router.get("/saved-blogs", verifyJWT, getSavedBlogs);
router.get("/liked-blogs", verifyJWT, getLikedBlogs);
router.get("/following", verifyJWT, getFollowingAuthors);
router.patch("/follow/:authorId", verifyJWT, toggleFollowAuthor);

export default router;
