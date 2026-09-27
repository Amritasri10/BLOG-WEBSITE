import { Router } from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateUserById,
  updatePassword,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserRole,
} from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

// ── Public ───────────────────────────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);

// ── User (requires auth) ─────────────────────────────────────────────────────
router.get("/profile", verifyJWT, getProfile);
router.patch("/update/:id", verifyJWT, updateUserById);
router.patch("/update-password", verifyJWT, updatePassword);

// ── Admin ────────────────────────────────────────────────────────────────────
router.get("/users", verifyJWT, isAdmin, getAllUsers);
router.get("/users/:userId", verifyJWT, isAdmin, getUserById);
router.put("/users/:userId/role", verifyJWT, isAdmin, updateUserRole);
router.delete("/users/:id", verifyJWT, isAdmin, deleteUser);

export default router;
