import Blog from "../../models/blog/Blog.modal.js";
import User from "../../models/User.modal.js";
import Comment from "../../models/blog/Comment.modal.js";
import Category from "../../models/blog/Category.modal.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// ─── Admin Dashboard Stats ───────────────────────────────────────────────────
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalBlogs, totalUsers, totalComments, totalCategories] =
    await Promise.all([
      Blog.countDocuments(),
      User.countDocuments(),
      Comment.countDocuments(),
      Category.countDocuments(),
    ]);

  const recentBlogs = await Blog.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "username email")
    .populate("category", "name");

  const topBlogs = await Blog.find()
    .sort({ views: -1 })
    .limit(5)
    .populate("user", "username email");

  return res.status(200).json(
    new apiResponse(
      200,
      {
        stats: {
          totalBlogs,
          totalUsers,
          totalComments,
          totalCategories,
        },
        recentBlogs,
        topBlogs,
      },
      "Dashboard stats fetched successfully"
    )
  );
});
