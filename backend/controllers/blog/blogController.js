import mongoose from "mongoose";
import Blog from "../../models/blog/Blog.modal.js";
import User from "../../models/User.modal.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateUniqueSlug } from "../../utils/helper.js";

// ─── Get All Blogs (paginated + search) ─────────────────────────────────────
export const getAllBlogs = asyncHandler(async (req, res) => {
  const {
    isPagination = "true",
    page = 1,
    limit = 10,
    search,
    category,
    sortBy = "recent",
    isPublished,
  } = req.query;

  const match = {};
  if (isPublished !== undefined) match.isPublished = isPublished === "true";
  if (category && mongoose.Types.ObjectId.isValid(category)) {
    match.category = new mongoose.Types.ObjectId(category);
  }

  let pipeline = [{ $match: match }];

  if (search) {
    const regex = new RegExp(search.trim(), "i");
    pipeline.push({
      $match: {
        $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
      },
    });
  }

  if (sortBy === "recent") {
    pipeline.push({ $sort: { createdAt: -1, _id: -1 } });
  } else if (sortBy === "oldest") {
    pipeline.push({ $sort: { createdAt: 1, _id: 1 } });
  } else if (sortBy === "popular") {
    pipeline.push({ $sort: { views: -1, _id: -1 } });
  } else {
    pipeline.push({ $sort: { _id: -1 } });
  }

  const totalArr = await Blog.aggregate([...pipeline, { $count: "count" }]);
  const total = totalArr[0]?.count || 0;

  if (isPagination === "true") {
    pipeline.push(
      { $skip: (Number(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { password: 0 } }],
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmpty: true } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmpty: true } }
  );

  const blogs = await Blog.aggregate(pipeline);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: blogs,
        total,
        totalPages: isPagination === "true" ? Math.ceil(total / parseInt(limit)) : 1,
        currentPage: isPagination === "true" ? Number(page) : null,
      },
      "Blogs fetched successfully"
    )
  );
});

// ─── Get Single Blog ─────────────────────────────────────────────────────────
export const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("user", "-password")
    .populate("category");

  if (!blog) {
    return res.status(404).json(new apiResponse(404, null, "Blog not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, blog, "Blog fetched successfully"));
});

// ─── Create Blog ─────────────────────────────────────────────────────────────
export const createBlog = asyncHandler(async (req, res) => {
  const { title, description, content, image, category, tags } = req.body;

  if (!title || !description || !image) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Title, description and image are required"));
  }

  const slug = await generateUniqueSlug({ schemaName: Blog, title });

  const newBlog = await Blog.create({
    title,
    description,
    content,
    image,
    category,
    tags,
    slug,
    user: req.user._id,
    isPublished: true,
  });

  // Add blog to user's blog list
  await User.findByIdAndUpdate(req.user._id, {
    $push: { blogs: newBlog._id },
  });

  return res
    .status(201)
    .json(new apiResponse(201, newBlog, "Blog created successfully"));
});

// ─── Update Blog ─────────────────────────────────────────────────────────────
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json(new apiResponse(404, null, "Blog not found"));
  }

  // Only author or admin can update
  if (blog.user.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
    return res
      .status(403)
      .json(new apiResponse(403, null, "You are not authorized to update this blog"));
  }

  const allowedFields = ["title", "description", "content", "image", "category", "tags", "isPublished"];
  allowedFields.forEach((key) => {
    if (req.body[key] !== undefined) blog[key] = req.body[key];
  });

  if (req.body.title) {
    blog.slug = await generateUniqueSlug({ schemaName: Blog, title: req.body.title });
  }

  await blog.save();

  return res
    .status(200)
    .json(new apiResponse(200, blog, "Blog updated successfully"));
});

// ─── Delete Blog ─────────────────────────────────────────────────────────────
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json(new apiResponse(404, null, "Blog not found"));
  }

  // Only author or admin can delete
  if (blog.user.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
    return res
      .status(403)
      .json(new apiResponse(403, null, "You are not authorized to delete this blog"));
  }

  await Blog.findByIdAndDelete(id);

  // Remove blog from user's blog list
  await User.findByIdAndUpdate(blog.user, {
    $pull: { blogs: id },
  });

  return res
    .status(200)
    .json(new apiResponse(200, blog, "Blog deleted successfully"));
});

// ─── Get User Blogs ───────────────────────────────────────────────────────────
export const getUserBlogs = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, isPagination = "true" } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid user ID"));
  }

  const match = { user: new mongoose.Types.ObjectId(userId) };
  let pipeline = [{ $match: match }, { $sort: { createdAt: -1 } }];

  const totalArr = await Blog.aggregate([...pipeline, { $count: "count" }]);
  const total = totalArr[0]?.count || 0;

  if (isPagination === "true") {
    pipeline.push(
      { $skip: (Number(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );
  }

  const blogs = await Blog.aggregate(pipeline);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: blogs,
        total,
        totalPages: isPagination === "true" ? Math.ceil(total / parseInt(limit)) : 1,
        currentPage: isPagination === "true" ? Number(page) : null,
      },
      "User blogs fetched successfully"
    )
  );
});

// ─── Toggle Like ─────────────────────────────────────────────────────────────
export const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json(new apiResponse(404, null, "Blog not found"));
  }

  const userId = req.user._id;
  const isLiked = blog.likes.includes(userId);

  if (isLiked) {
    blog.likes.pull(userId);
  } else {
    blog.likes.push(userId);
  }

  await blog.save();

  return res.status(200).json(
    new apiResponse(
      200,
      { likesCount: blog.likes.length, isLiked: !isLiked },
      isLiked ? "Blog unliked" : "Blog liked"
    )
  );
});
