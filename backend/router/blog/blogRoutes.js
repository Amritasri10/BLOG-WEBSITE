import { Router } from "express";
import {
  getAllBlogs,
  getSingleBlog,
  getAuthorBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
  togglePublish,
  toggleLike,
  toggleSave,
} from "../../controllers/blog/blogController.js";
import { verifyJWT, isAuthor } from "../../middlewares/authMiddleware.js";

const router = Router();

// ══ PUBLIC ════════════════════════════════════════════════════════════════════
router.get("/all-blogs", getAllBlogs);
router.get("/get-blog/:id", getSingleBlog);
router.get("/author/:authorId", getAuthorBlogs);   // Author ki public blogs

// ══ AUTHOR only ═══════════════════════════════════════════════════════════════
router.post("/create", verifyJWT, isAuthor, createBlog);
router.get("/my-blogs", verifyJWT, isAuthor, getMyBlogs);          // apne sare blogs (drafts bhi)
router.patch("/toggle-publish/:id", verifyJWT, isAuthor, togglePublish); // publish/draft toggle

// ══ AUTHOR (apna) + ADMIN (sab) ═══════════════════════════════════════════════
router.put("/update/:id", verifyJWT, updateBlog);
router.delete("/delete/:id", verifyJWT, deleteBlog);

// ══ USER (logged-in) ══════════════════════════════════════════════════════════
router.patch("/like/:id", verifyJWT, toggleLike);
router.patch("/save/:id", verifyJWT, toggleSave);

export default router;
