import { noTokenGetRequest, postRequest, patchRequest, deleteRequest } from "../Helpers/index.js";

// ── Public ────────────────────────────────────────────────────────────────────

export const getCommentsByBlogApi = (blogId) =>
  noTokenGetRequest(`/comments/${blogId}`);

// ── User / Author (logged-in) ─────────────────────────────────────────────────

export const addCommentApi = (blogId, content) =>
  postRequest({ url: `/comments/${blogId}`, cred: { content } });

// ── Author (own blog) + Admin ─────────────────────────────────────────────────

export const approveCommentApi = (id) =>
  patchRequest({ url: `/comments/${id}/approve`, cred: {} });

export const deleteCommentApi = (id) =>
  deleteRequest(`/comments/${id}`);
