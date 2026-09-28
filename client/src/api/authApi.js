import {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
} from "../Helpers/index.js";

// ── Public ────────────────────────────────────────────────────────────────────

export const registerUserApi = (payload) =>
  postRequest({
    url: "/auth/register",
    cred: payload,
  });

export const registerAuthorApi = (payload) =>
  postRequest({
    url: "/auth/register-author",
    cred: payload,
  });

export const loginUserApi = (payload) =>
  postRequest({
    url: "/auth/login",
    cred: payload,
  });


// ── Protected ─────────────────────────────────────────────────────────────────

export const getProfileApi = () =>
  getRequest("/auth/profile");

export const updateProfileApi = (payload) =>
  patchRequest({
    url: "/auth/update-profile",
    cred: payload,
  });

export const updatePasswordApi = (payload) =>
  patchRequest({
    url: "/auth/update-password",
    cred: payload,
  });


// ── Admin only ────────────────────────────────────────────────────────────────

export const getAllUsersApi = (role = "") =>
  getRequest(`/auth/users${role ? `?role=${role}` : ""}`);

export const updateUserRoleApi = (userId, role) =>
  putRequest({
    url: `/auth/users/${userId}/role`,
    cred: {
      role,
    },
  });

export const deleteUserApi = (userId) =>
  deleteRequest(`/auth/users/${userId}`);