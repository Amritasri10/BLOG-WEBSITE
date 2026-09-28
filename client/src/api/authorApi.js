import { noTokenGetRequest, getRequest } from "../Helpers/index.js";

// ── Public ────────────────────────────────────────────────────────────────────

export const getAllAuthorsApi = () =>
  noTokenGetRequest("/authors/all");

export const getPublicAuthorProfileApi = (authorId) =>
  noTokenGetRequest(`/authors/profile/${authorId}`);

// ── Author protected ──────────────────────────────────────────────────────────

export const getAuthorDashboardApi = () =>
  getRequest("/authors/dashboard");

export const getPendingCommentsApi = () =>
  getRequest("/authors/pending-comments");
