import mongoose from "mongoose";
import Blog from "../../models/blog/Blog.modal.js";
import User from "../../models/User.modal.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateUniqueSlug } from "../../utils/helper.js";

// ════════════════════════════════════════════════════════════════════════════
//  PUBLIC — koi bhi dekh sakta hai
// ════════════════════════════════════════════════════════════════════════════

// ─── Get All Blogs ────────────────────────────────────────────────────────────
export const getAllBlogs = asyncHandler(async (req, res) => {
  const {
    isPagination = "true",
    page = 1,
    limit = 10,
    search,
    category,
    sortBy = "recent",
  } = req.query;

  // Public ko sirf published blogs dikhte hain
  const match = { isPublished: true };
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

  if (sortBy === "recent") pipeline.push({ $sort: { createdAt: -1 } });
  else if (sortBy === "oldest") pipeline.push({ $sort: { createdAt: 1 } });
  else if (sortBy === "popular") pipeline.push({ $sort: { views: -1 } });
  else pipeline.push({ $sort: { _id: -1 } });

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
        as: "author",
        pipeline: [{ $project: { username: 1, profilePic: 1, bio: 1 } }],
      },
    },
    { $unwind: { path: "$author", preserveNullAndEmpty: true } },
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

// ─── Get Single Blog ──────────────────────────────────────────────────────────
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
    .populate("user", "username profilePic bio")
    .populate("category", "name slug");

  if (!blog) {
    return res.status(404).json(new apiResponse(404, null, "Blog not found"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, blog, "Blog fetched successfully"));
});

// ─── Get Author's Public Blogs ────────────────────────────────────────────────
// /api/blogs/author/:authorId → koi bhi dekh sakta
export const getAuthorBlogs = asyncHandler(async (req, res) => {
  const { authorId } = req.params;
  const { page = 1, limit = 10, isPagination = "true" } = req.query;

  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid author ID"));
  }

  // Public me sirf published blogs
  const match = {
    user: new mongoose.Types.ObjectId(authorId),
    isPublished: true,
  };

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
      "Author blogs fetched successfully"
    )
  );
});

// ════════════════════════════════════════════════════════════════════════════
//  AUTHOR — Blog likhna, manage karna
// ════════════════════════════════════════════════════════════════════════════

// ─── Create Blog (Author only) ────────────────────────────────────────────────
export const createBlog = asyncHandler(async (req, res) => {
  const { title, description, content, image, category, tags, isPublished = true } = req.body;

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
    isPublished,
    user: req.user._id,  // req.user = logged-in Author
  });

  // Author ke blogs array me add karo
  await User.findByIdAndUpdate(req.user._id, {
    $push: { blogs: newBlog._id },
  });

  return res
    .status(201)
    .json(new apiResponse(201, newBlog, "Blog created successfully"));
});

// ─── Update Blog (Author apna hi, Admin sab) ─────────────────────────────────
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json(new apiResponse(404, null, "Blog not found"));
  }

  // Author sirf apna blog update kar sakta, Admin sab
  const isOwner = blog.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json(new apiResponse(403, null, "You can only update your own blog"));
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

// ─── Delete Blog (Author apna hi, Admin sab) ──────────────────────────────────
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json(new apiResponse(404, null, "Blog not found"));
  }

  const isOwner = blog.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json(new apiResponse(403, null, "You can only delete your own blog"));
  }

  await Blog.findByIdAndDelete(id);

  // Author ke blogs array se remove karo
  await User.findByIdAndUpdate(blog.user, {
    $pull: { blogs: id },
  });

  return res
    .status(200)
    .json(new apiResponse(200, null, "Blog deleted successfully"));
});

// ─── Get My Blogs — Author ka Dashboard ──────────────────────────────────────
// Author apne sare blogs dekh sakta (published + drafts dono)
export const getMyBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isPagination = "true", isPublished } = req.query;

  const match = { user: new mongoose.Types.ObjectId(req.user._id) };

  // ?isPublished=true → published, ?isPublished=false → drafts
  if (isPublished !== undefined) match.isPublished = isPublished === "true";

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
      "My blogs fetched successfully"
    )
  );
});

// ─── Toggle Publish/Draft ─────────────────────────────────────────────────────
export const togglePublish = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json(new apiResponse(404, null, "Blog not found"));
  }

  const isOwner = blog.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json(new apiResponse(403, null, "Not authorized"));
  }

  blog.isPublished = !blog.isPublished;
  await blog.save();

  return res.status(200).json(
    new apiResponse(
      200,
      { isPublished: blog.isPublished },
      blog.isPublished ? "Blog published" : "Blog moved to drafts"
    )
  );
});

// ════════════════════════════════════════════════════════════════════════════
//  USER — Reader actions (like/save)
// ════════════════════════════════════════════════════════════════════════════

// ─── Toggle Like ──────────────────────────────────────────────────────────────
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
    // User ke likedBlogs se bhi remove
    await User.findByIdAndUpdate(userId, { $pull: { likedBlogs: id } });
  } else {
    blog.likes.push(userId);
    // User ke likedBlogs me add
    await User.findByIdAndUpdate(userId, { $addToSet: { likedBlogs: id } });
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

// ─── Toggle Save (Bookmark) ───────────────────────────────────────────────────
export const toggleSave = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  const user = await User.findById(req.user._id);
  const isSaved = user.savedBlogs.includes(id);

  if (isSaved) {
    await User.findByIdAndUpdate(req.user._id, { $pull: { savedBlogs: id } });
  } else {
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedBlogs: id } });
  }

  return res.status(200).json(
    new apiResponse(
      200,
      { isSaved: !isSaved },
      isSaved ? "Blog removed from saved" : "Blog saved"
    )
  );
});
