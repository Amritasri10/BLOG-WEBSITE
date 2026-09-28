import { noTokenGetRequest, postRequest, deleteRequest } from "../Helpers/index.js";

// ── Public ────────────────────────────────────────────────────────────────────

export const getAllCategoriesApi = () =>
  noTokenGetRequest("/categories");

// ── Admin only ────────────────────────────────────────────────────────────────

export const createCategoryApi = (payload) =>
  postRequest({ url: "/categories", cred: payload });

export const deleteCategoryApi = (id) =>
  deleteRequest(`/categories/${id}`);
