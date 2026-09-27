import {
  noTokenGetRequest,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  patchRequest,
} from "../Helpers";

/**
 * GET /blogs/all-blogs  (public)
 */
export const getAllBlogsApi = () => noTokenGetRequest("/blogs/all-blogs");

/**
 * GET /blogs/get-blog/:id  (public)
 */
export const getSingleBlogApi = (id) => noTokenGetRequest(`/blogs/get-blog/${id}`);

/**
 * GET /blogs/user-blogs/:userId  (public)
 */
export const getUserBlogsApi = (userId) => noTokenGetRequest(`/blogs/user-blogs/${userId}`);

/**
 * POST /blogs/create-blog  (protected)
 */
export const createBlogApi = (payload) =>
  postRequest({ url: "/blogs/create-blog", cred: payload });

/**
 * PUT /blogs/update-blog/:id  (protected)
 */
export const updateBlogApi = (id, payload) =>
  putRequest({ url: `/blogs/update-blog/${id}`, cred: payload });

/**
 * DELETE /blogs/delete-blog/:id  (protected)
 */
export const deleteBlogApi = (id) => deleteRequest(`/blogs/delete-blog/${id}`);

/**
 * PATCH /blogs/like/:id  (protected)
 */
export const toggleLikeApi = (id) => patchRequest({ url: `/blogs/like/${id}`, cred: {} });
