import Blog from "../../models/blog/Blog.modal.js";
import User from "../../models/User.modal.js";
import Comment from "../../models/blog/Comment.modal.js";
import Category from "../../models/blog/Category.modal.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// ─── Admin Dashboard Stats ────────────────────────────────────────────────────
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalUsers,
    totalAuthors,
    totalComments,
    pendingComments,
    totalCategories,
  ] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ isPublished: true }),
    Blog.countDocuments({ isPublished: false }),
    User.countDocuments({ role: "User" }),
    User.countDocuments({ role: "Author" }),
    Comment.countDocuments(),
    Comment.countDocuments({ isApproved: false }),
    Category.countDocuments(),
  ]);

  const recentBlogs = await Blog.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "username profilePic")
    .populate("category", "name");

  const topBlogs = await Blog.find({ isPublished: true })
    .sort({ views: -1 })
    .limit(5)
    .populate("user", "username");

  const pendingCommentsList = await Comment.find({ isApproved: false })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("user", "username profilePic")
    .populate("blog", "title");

  return res.status(200).json(
    new apiResponse(
      200,
      {
        stats: {
          totalBlogs,
          publishedBlogs,
          draftBlogs,
          totalUsers,
          totalAuthors,
          totalComments,
          pendingComments,
          totalCategories,
        },
        recentBlogs,
        topBlogs,
        pendingCommentsList,
      },
      "Dashboard stats fetched successfully"
    )
  );
});
