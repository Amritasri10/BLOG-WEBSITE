import mongoose from "mongoose";
import Blog from "../../models/blog/Blog.modal.js";
import Comment from "../../models/blog/Comment.modal.js";
import User from "../../models/User.modal.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// ─── Author Dashboard Stats ───────────────────────────────────────────────────
export const getAuthorDashboard = asyncHandler(async (req, res) => {
  const authorId = req.user._id;

  const [
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalComments,
    pendingComments,
  ] = await Promise.all([
    Blog.countDocuments({ user: authorId }),
    Blog.countDocuments({ user: authorId, isPublished: true }),
    Blog.countDocuments({ user: authorId, isPublished: false }),
    Comment.countDocuments({ blog: { $in: await Blog.find({ user: authorId }).distinct("_id") } }),
    Comment.countDocuments({
      blog: { $in: await Blog.find({ user: authorId }).distinct("_id") },
      isApproved: false,
    }),
  ]);

  // Total views — sabhi blogs ke views ka sum
  const viewsAgg = await Blog.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(authorId) } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);
  const totalViews = viewsAgg[0]?.totalViews || 0;

  // Total likes
  const likesAgg = await Blog.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(authorId) } },
    { $project: { likeCount: { $size: "$likes" } } },
    { $group: { _id: null, totalLikes: { $sum: "$likeCount" } } },
  ]);
  const totalLikes = likesAgg[0]?.totalLikes || 0;

  // Recent 5 blogs
  const recentBlogs = await Blog.find({ user: authorId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title isPublished views likes createdAt slug");

  // Top 5 blogs by views
  const topBlogs = await Blog.find({ user: authorId, isPublished: true })
    .sort({ views: -1 })
    .limit(5)
    .select("title views likes createdAt slug");

  return res.status(200).json(
    new apiResponse(
      200,
      {
        stats: {
          totalBlogs,
          publishedBlogs,
          draftBlogs,
          totalComments,
          pendingComments,
          totalViews,
          totalLikes,
        },
        recentBlogs,
        topBlogs,
      },
      "Author dashboard fetched successfully"
    )
  );
});

// ─── Get Author's Pending Comments ───────────────────────────────────────────
export const getAuthorPendingComments = asyncHandler(async (req, res) => {
  const authorId = req.user._id;
  const { page = 1, limit = 10, isPagination = "true" } = req.query;

  // Author ke blogs ki IDs
  const authorBlogIds = await Blog.find({ user: authorId }).distinct("_id");

  const match = {
    blog: { $in: authorBlogIds },
    isApproved: false,
  };

  let pipeline = [{ $match: match }, { $sort: { createdAt: -1 } }];

  const totalArr = await Comment.aggregate([...pipeline, { $count: "count" }]);
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
        pipeline: [{ $project: { username: 1, profilePic: 1 } }],
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmpty: true } },
    {
      $lookup: {
        from: "blogs",
        localField: "blog",
        foreignField: "_id",
        as: "blog",
        pipeline: [{ $project: { title: 1, slug: 1 } }],
      },
    },
    { $unwind: { path: "$blog", preserveNullAndEmpty: true } }
  );

  const comments = await Comment.aggregate(pipeline);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: comments,
        total,
        totalPages: isPagination === "true" ? Math.ceil(total / parseInt(limit)) : 1,
        currentPage: isPagination === "true" ? Number(page) : null,
      },
      "Pending comments fetched successfully"
    )
  );
});

// ─── Get Author Profile (Public) ─────────────────────────────────────────────
export const getPublicAuthorProfile = asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid author ID"));
  }

  const author = await User.findOne({ _id: authorId, role: "Author" })
    .select("username profilePic bio createdAt followingAuthors");

  if (!author) {
    return res.status(404).json(new apiResponse(404, null, "Author not found"));
  }

  const totalPublishedBlogs = await Blog.countDocuments({
    user: authorId,
    isPublished: true,
  });

  return res.status(200).json(
    new apiResponse(
      200,
      {
        author,
        totalPublishedBlogs,
      },
      "Author profile fetched successfully"
    )
  );
});

// ─── Get All Authors (Public Directory) ──────────────────────────────────────
export const getAllAuthors = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isPagination = "true" } = req.query;

  const match = { role: "Author" };

  let pipeline = [{ $match: match }];

  if (search) {
    const regex = new RegExp(search.trim(), "i");
    pipeline.push({
      $match: { $or: [{ username: regex }, { bio: regex }] },
    });
  }

  pipeline.push({ $sort: { createdAt: -1 } });

  const totalArr = await User.aggregate([...pipeline, { $count: "count" }]);
  const total = totalArr[0]?.count || 0;

  if (isPagination === "true") {
    pipeline.push(
      { $skip: (Number(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    );
  }

  pipeline.push({
    $project: { password: 0, savedBlogs: 0, likedBlogs: 0, followingAuthors: 0 },
  });

  const authors = await User.aggregate(pipeline);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: authors,
        total,
        totalPages: isPagination === "true" ? Math.ceil(total / parseInt(limit)) : 1,
        currentPage: isPagination === "true" ? Number(page) : null,
      },
      "Authors fetched successfully"
    )
  );
});
