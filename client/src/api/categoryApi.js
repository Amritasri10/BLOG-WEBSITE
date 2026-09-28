import { noTokenGetRequest, postRequest, putRequest, deleteRequest } from "../Helpers/index.js";

// ── Public ────────────────────────────────────────────────────────────────────

export const getAllCategoriesApi = () =>
  noTokenGetRequest("/categories");

// ── Admin only ────────────────────────────────────────────────────────────────

export const createCategoryApi = (payload) =>
  postRequest({ url: "/categories", cred: payload });

export const updateCategoryApi = (id, payload) =>
  putRequest({ url: `/categories/${id}`, cred: payload });

export const deleteCategoryApi = (id) =>
  deleteRequest(`/categories/${id}`);
