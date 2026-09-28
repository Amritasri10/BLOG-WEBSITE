import { Router } from "express";
import {
  registerUser,
  registerAuthor,
  loginUser,
  getProfile,
  updateProfile,
  updatePassword,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserRole,
} from "../controllers/authController.js";
import { verifyJWT, isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// ── PUBLIC ───────────────────────────────────────────────────────────────────
router.post("/register", registerUser);           // User (Reader) register
router.post("/register-author", registerAuthor);  // Author register
router.post("/login", loginUser);                 // User / Author / Admin login

// ── PROTECTED (any logged-in user) ───────────────────────────────────────────
router.get("/profile", verifyJWT, getProfile);
router.patch("/update-profile", verifyJWT, updateProfile);
router.patch("/update-password", verifyJWT, updatePassword);

// ── ADMIN only ────────────────────────────────────────────────────────────────
router.get("/users", verifyJWT, isAdmin, getAllUsers);              // sab users (filter by role)
router.get("/users/:userId", verifyJWT, isAdmin, getUserById);      // ek user
router.put("/users/:userId/role", verifyJWT, isAdmin, updateUserRole); // role change
router.delete("/users/:id", verifyJWT, isAdmin, deleteUser);        // delete user

export default router;
