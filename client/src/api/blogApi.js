import {
  noTokenGetRequest,
  getRequest,
  putRequest,
  patchRequest,
  deleteRequest,
  fileUpload,
} from "../Helpers/index.js";

// ── Public ────────────────────────────────────────────────────────────────────

export const getAllBlogsApi = (params = "") =>
  noTokenGetRequest(`/blogs/all-blogs${params}`);

export const getSingleBlogApi = (id) =>
  noTokenGetRequest(`/blogs/get-blog/${id}`);

export const getAuthorBlogsApi = (authorId) =>
  noTokenGetRequest(`/blogs/author/${authorId}`);

// ── Author protected ──────────────────────────────────────────────────────────

export const getMyBlogsApi = () =>
  getRequest("/blogs/my-blogs");

export const createBlogApi = (formData) =>
  fileUpload({ url: "/blogs/create", cred: formData });

export const updateBlogApi = (id, payload) =>
  putRequest({ url: `/blogs/update/${id}`, cred: payload });

export const deleteBlogApi = (id) =>
  deleteRequest(`/blogs/delete/${id}`);

export const togglePublishApi = (id) =>
  patchRequest({ url: `/blogs/toggle-publish/${id}`, cred: {} });

// ── User engagement ───────────────────────────────────────────────────────────

export const toggleLikeApi = (id) =>
  patchRequest({ url: `/blogs/like/${id}`, cred: {} });

export const toggleSaveApi = (id) =>
  patchRequest({ url: `/blogs/save/${id}`, cred: {} });
