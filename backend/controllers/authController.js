import User from "../models/User.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// ════════════════════════════════════════════════════════════════════════════
//  PUBLIC — Register & Login
// ════════════════════════════════════════════════════════════════════════════

// ─── Register as User (Reader) ───────────────────────────────────────────────
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Username, email and password are required"));
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Email or username already registered"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: "User",
  });

  const token = user.generateAuthToken();

  return res.status(201).json(
    new apiResponse(
      201,
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        authToken: token,
      },
      "User registered successfully"
    )
  );
});

// ─── Register as Author ──────────────────────────────────────────────────────
export const registerAuthor = asyncHandler(async (req, res) => {
  const { username, email, password, bio } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Username, email and password are required"));
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Email or username already registered"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const author = await User.create({
    username,
    email,
    password: hashedPassword,
    bio: bio || "",
    role: "Author",
  });

  const token = author.generateAuthToken();

  return res.status(201).json(
    new apiResponse(
      201,
      {
        _id: author._id,
        username: author.username,
        email: author.email,
        role: author.role,
        bio: author.bio,
        authToken: token,
      },
      "Author registered successfully"
    )
  );
});

// ─── Login (User / Author / Admin — sab ek hi route) ────────────────────────
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Email and password are required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid email or password"));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid email or password"));
  }

  const token = user.generateAuthToken();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,         // frontend isko dekhke redirect karega
        profilePic: user.profilePic,
        bio: user.bio,
        authToken: token,
      },
      "Login successful"
    )
  );
});

// ════════════════════════════════════════════════════════════════════════════
//  PROTECTED — Profile
// ════════════════════════════════════════════════════════════════════════════

// ─── Get My Profile ───────────────────────────────────────────────────────────
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("blogs", "title slug createdAt isPublished");

  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "Profile fetched successfully"));
});

// ─── Update My Profile ────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  const allowedFields = ["username", "bio", "profilePic"];
  allowedFields.forEach((key) => {
    if (req.body[key] !== undefined) user[key] = req.body[key];
  });

  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, user, "Profile updated successfully"));
});

// ─── Update Password ─────────────────────────────────────────────────────────
export const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Old and new password are required"));
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Old password is incorrect"));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, null, "Password updated successfully"));
});

// ════════════════════════════════════════════════════════════════════════════
//  BOOTSTRAP — Pehla Admin (sirf tab jab koi Admin DB me na ho)
// ════════════════════════════════════════════════════════════════════════════

// PUT /api/auth/self-promote
// Logged-in user apne aap ko Admin bana sakta hai
// SIRF tab kaam karta hai jab DB me koi bhi Admin na ho
export const selfPromoteToAdmin = asyncHandler(async (req, res) => {
  const adminExists = await User.findOne({ role: "Admin" });

  if (adminExists) {
    return res
      .status(403)
      .json(new apiResponse(403, null, "Admin already exists. Self-promotion not allowed."));
  }

  const user = await User.findById(req.user._id);
  user.role = "Admin";
  await user.save();

  const token = user.generateAuthToken(); // naya token Admin role ke saath

  return res.status(200).json(
    new apiResponse(
      200,
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        authToken: token,
      },
      "You are now Admin"
    )
  );
});

// ════════════════════════════════════════════════════════════════════════════
//  ADMIN — User Management
// ════════════════════════════════════════════════════════════════════════════

// ─── Get All Users (with role filter) ────────────────────────────────────────
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role, isPagination = "true" } = req.query;

  const match = {};
  // role filter: ?role=User  OR  ?role=Author  OR  ?role=Admin
  if (role) match.role = role;

  let pipeline = [{ $match: match }];

  if (search) {
    const regex = new RegExp(search.trim(), "i");
    pipeline.push({
      $match: { $or: [{ username: regex }, { email: regex }] },
    });
  }

  pipeline.push({ $sort: { createdAt: -1 } });

  const totalArr = await User.aggregate([...pipeline, { $count: "count" }]);
  const total = totalArr[0]?.count || 0;

  if (isPagination === "true") {
    pipeline.push(
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) }
    );
  }

  pipeline.push({ $project: { password: 0 } });

  const users = await User.aggregate(pipeline);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        users,
        total,
        totalPages:
          isPagination === "true" ? Math.ceil(total / Number(limit)) : 1,
        currentPage: isPagination === "true" ? Number(page) : null,
      },
      "Users fetched successfully"
    )
  );
});

// ─── Get User By ID ───────────────────────────────────────────────────────────
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid user ID"));
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "User fetched successfully"));
});

// ─── Update User Role (Admin only) ───────────────────────────────────────────
// Admin kisi bhi user ko User / Author / Admin bana sakta hai
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const ALLOWED_ROLES = ["User", "Author", "Admin"];
  if (!role || !ALLOWED_ROLES.includes(role.trim())) {
    return res
      .status(400)
      .json(
        new apiResponse(400, null, `Role must be one of: ${ALLOWED_ROLES.join(", ")}`)
      );
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  user.role = role.trim();
  await user.save();

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { userId: user._id, role: user.role },
        "Role updated successfully"
      )
    );
});

// ─── Delete User (Admin only) ─────────────────────────────────────────────────
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }
  return res
    .status(200)
    .json(new apiResponse(200, null, "User deleted successfully"));
});
