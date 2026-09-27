import { Router } from "express";
import {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  toggleLike,
} from "../../controllers/blog/blogController.js";
import { verifyJWT } from "../../middlewares/authMiddleware.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/all-blogs", getAllBlogs);
router.get("/get-blog/:id", getSingleBlog);
router.get("/user-blogs/:userId", getUserBlogs);

// ── Protected ─────────────────────────────────────────────────────────────────
router.post("/create-blog", verifyJWT, createBlog);
router.put("/update-blog/:id", verifyJWT, updateBlog);
router.delete("/delete-blog/:id", verifyJWT, deleteBlog);
router.patch("/like/:id", verifyJWT, toggleLike);

export default router;
