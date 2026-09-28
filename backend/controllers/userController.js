import mongoose from "mongoose";
import User from "../models/User.modal.js";
import Blog from "../models/blog/Blog.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Get My Saved Blogs ───────────────────────────────────────────────────────
export const getSavedBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isPagination = "true" } = req.query;

  const user = await User.findById(req.user._id).select("savedBlogs");
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  const savedBlogIds = user.savedBlogs;
  const total = savedBlogIds.length;

  let blogsQuery = Blog.find({ _id: { $in: savedBlogIds }, isPublished: true })
    .populate("user", "username profilePic")
    .populate("category", "name")
    .sort({ createdAt: -1 });

  if (isPagination === "true") {
    blogsQuery = blogsQuery
      .skip((Number(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
  }

  const blogs = await blogsQuery;

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: blogs,
        total,
        totalPages: isPagination === "true" ? Math.ceil(total / parseInt(limit)) : 1,
        currentPage: isPagination === "true" ? Number(page) : null,
      },
      "Saved blogs fetched successfully"
    )
  );
});

// ─── Get My Liked Blogs ───────────────────────────────────────────────────────
export const getLikedBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isPagination = "true" } = req.query;

  const user = await User.findById(req.user._id).select("likedBlogs");
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  const likedBlogIds = user.likedBlogs;
  const total = likedBlogIds.length;

  let blogsQuery = Blog.find({ _id: { $in: likedBlogIds }, isPublished: true })
    .populate("user", "username profilePic")
    .populate("category", "name")
    .sort({ createdAt: -1 });

  if (isPagination === "true") {
    blogsQuery = blogsQuery
      .skip((Number(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
  }

  const blogs = await blogsQuery;

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: blogs,
        total,
        totalPages: isPagination === "true" ? Math.ceil(total / parseInt(limit)) : 1,
        currentPage: isPagination === "true" ? Number(page) : null,
      },
      "Liked blogs fetched successfully"
    )
  );
});

// ─── Toggle Follow Author ─────────────────────────────────────────────────────
export const toggleFollowAuthor = asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid author ID"));
  }

  // Apne aap ko follow nahi kar sakte
  if (authorId === req.user._id.toString()) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "You cannot follow yourself"));
  }

  const author = await User.findOne({ _id: authorId, role: "Author" });
  if (!author) {
    return res.status(404).json(new apiResponse(404, null, "Author not found"));
  }

  const user = await User.findById(req.user._id);
  const isFollowing = user.followingAuthors.includes(authorId);

  if (isFollowing) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { followingAuthors: authorId },
    });
  } else {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { followingAuthors: authorId },
    });
  }

  return res.status(200).json(
    new apiResponse(
      200,
      { isFollowing: !isFollowing },
      isFollowing ? "Author unfollowed" : "Author followed"
    )
  );
});

// ─── Get Following Authors ────────────────────────────────────────────────────
export const getFollowingAuthors = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("followingAuthors")
    .populate("followingAuthors", "username profilePic bio");

  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User not found"));
  }

  return res.status(200).json(
    new apiResponse(200, user.followingAuthors, "Following authors fetched successfully")
  );
});
