import { getRequest, patchRequest } from "../Helpers/index.js";

// ── Reader (logged-in) ────────────────────────────────────────────────────────

export const getSavedBlogsApi = () =>
  getRequest("/user/saved-blogs");

export const getLikedBlogsApi = () =>
  getRequest("/user/liked-blogs");

export const getFollowingAuthorsApi = () =>
  getRequest("/user/following");

export const toggleFollowAuthorApi = (authorId) =>
  patchRequest({ url: `/user/follow/${authorId}`, cred: {} });
