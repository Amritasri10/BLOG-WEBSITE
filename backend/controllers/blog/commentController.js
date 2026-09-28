import mongoose from "mongoose";
import Comment from "../../models/blog/Comment.modal.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// ─── Get Comments By Blog (Public) ───────────────────────────────────────────
export const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { page = 1, limit = 10, isPagination = "true" } = req.query;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  // Public ko sirf approved comments dikhte hain
  const match = {
    blog: new mongoose.Types.ObjectId(blogId),
    isApproved: true,
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

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user",
      pipeline: [{ $project: { username: 1, profilePic: 1 } }],
    },
  });

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
      "Comments fetched successfully"
    )
  );
});

// ─── Add Comment (User / Author dono kar sakte hain) ─────────────────────────
export const addComment = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json(new apiResponse(400, null, "Comment content is required"));
  }

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid blog ID"));
  }

  const comment = await Comment.create({
    content,
    user: req.user._id,
    blog: blogId,
    isApproved: false, // Admin/Author approve karega
  });

  return res
    .status(201)
    .json(new apiResponse(201, comment, "Comment submitted for approval"));
});

// ─── Update Comment (sirf apna) ───────────────────────────────────────────────
export const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid comment ID"));
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).json(new apiResponse(404, null, "Comment not found"));
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(new apiResponse(403, null, "You can only update your own comment"));
  }

  comment.content = content;
  comment.isApproved = false; // edit ke baad re-approve hoga
  await comment.save();

  return res
    .status(200)
    .json(new apiResponse(200, comment, "Comment updated, pending approval"));
});

// ─── Delete Comment ───────────────────────────────────────────────────────────
// User apna delete kar sakta, Author apne blog ke comments, Admin sab
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid comment ID"));
  }

  const comment = await Comment.findById(id).populate("blog", "user");
  if (!comment) {
    return res.status(404).json(new apiResponse(404, null, "Comment not found"));
  }

  const isCommentOwner = comment.user.toString() === req.user._id.toString();
  const isBlogAuthor = comment.blog?.user?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "Admin";

  if (!isCommentOwner && !isBlogAuthor && !isAdmin) {
    return res
      .status(403)
      .json(new apiResponse(403, null, "Not authorized to delete this comment"));
  }

  await Comment.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new apiResponse(200, null, "Comment deleted successfully"));
});

// ─── Approve Comment (Author apne blog ke, Admin sab) ────────────────────────
export const approveComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid comment ID"));
  }

  const comment = await Comment.findById(id).populate("blog", "user");
  if (!comment) {
    return res.status(404).json(new apiResponse(404, null, "Comment not found"));
  }

  const isBlogAuthor = comment.blog?.user?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "Admin";

  if (!isBlogAuthor && !isAdmin) {
    return res
      .status(403)
      .json(new apiResponse(403, null, "Not authorized to approve this comment"));
  }

  comment.isApproved = true;
  await comment.save();

  return res
    .status(200)
    .json(new apiResponse(200, comment, "Comment approved successfully"));
});
