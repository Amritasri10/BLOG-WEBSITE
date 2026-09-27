import {
  noTokenGetRequest,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  patchRequest,
} from "../Helpers";

// ── Blogs ─────────────────────────────────────────────────────────────────────

export const getAllBlogsApi = (params = "") =>
  noTokenGetRequest(`/blogs/all-blogs${params}`);

export const getSingleBlogApi = (id) =>
  noTokenGetRequest(`/blogs/get-blog/${id}`);

export const getUserBlogsApi = (userId) =>
  noTokenGetRequest(`/blogs/user-blogs/${userId}`);

export const createBlogApi = (payload) =>
  postRequest({ url: "/blogs/create-blog", cred: payload });

export const updateBlogApi = (id, payload) =>
  putRequest({ url: `/blogs/update-blog/${id}`, cred: payload });

export const deleteBlogApi = (id) =>
  deleteRequest(`/blogs/delete-blog/${id}`);

export const toggleLikeApi = (id) =>
  patchRequest({ url: `/blogs/like/${id}`, cred: {} });

// ── Categories ────────────────────────────────────────────────────────────────

export const getAllCategoriesApi = () =>
  noTokenGetRequest("/categories");

// ── Comments ──────────────────────────────────────────────────────────────────

export const getCommentsByBlogApi = (blogId) =>
  noTokenGetRequest(`/comments/${blogId}`);

export const addCommentApi = (blogId, content) =>
  postRequest({ url: `/comments/${blogId}`, cred: { content } });

export const deleteCommentApi = (commentId) =>
  deleteRequest(`/comments/${commentId}`);
