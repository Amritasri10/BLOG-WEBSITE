import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import User from "../models/User.modal.js";

// ─── Verify JWT Token ────────────────────────────────────────────────────────
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      apiError(res, 401, false, "Unauthorized: No token provided");
      return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.userId).select("-password");

    if (!user) {
      apiError(res, 401, false, "Invalid token: User not found");
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    apiError(res, 401, false, error?.message || "Invalid access token");
    return;
  }
});

// ─── Role-based Access ───────────────────────────────────────────────────────
// Usage: authorizeRole("Admin", "Author")
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return apiError(res, 401, false, "Unauthorized: No user data");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return apiError(
        res,
        403,
        false,
        `Access denied. Required role: ${allowedRoles.join(" or ")}`
      );
    }

    next();
  };
};

// ─── isAdmin middleware ──────────────────────────────────────────────────────
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return apiError(res, 403, false, "Access denied: Admin only");
  }
  next();
};

// ─── isAuthor middleware ─────────────────────────────────────────────────────
export const isAuthor = (req, res, next) => {
  if (req.user?.role !== "Author" && req.user?.role !== "Admin") {
    return apiError(
      res,
      403,
      false,
      "Access denied: Author or Admin only"
    );
  }
  next();
};
