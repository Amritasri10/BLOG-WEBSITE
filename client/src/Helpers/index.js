import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ── Token helper ──────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("authToken");

// ── Auth headers (with token) ─────────────────────────────────────────────────
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// ── Handle 401 ────────────────────────────────────────────────────────────────
const handle401 = (error) => {
  if (error?.response?.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  }
  throw error;
};

// ── WITH TOKEN ────────────────────────────────────────────────────────────────

export const getRequest = async (url) => {
  try {
    return await axios.get(`${BASE_URL}${url}`, { headers: authHeaders() });
  } catch (error) {
    return handle401(error);
  }
};

export const postRequest = async ({ url, cred }) => {
  try {
    return await axios.post(`${BASE_URL}${url}`, cred, { headers: authHeaders() });
  } catch (error) {
    return handle401(error);
  }
};

export const putRequest = async ({ url, cred }) => {
  try {
    return await axios.put(`${BASE_URL}${url}`, cred, { headers: authHeaders() });
  } catch (error) {
    return handle401(error);
  }
};

export const patchRequest = async ({ url, cred }) => {
  try {
    return await axios.patch(`${BASE_URL}${url}`, cred, { headers: authHeaders() });
  } catch (error) {
    return handle401(error);
  }
};

export const deleteRequest = async (url) => {
  try {
    return await axios.delete(`${BASE_URL}${url}`, { headers: authHeaders() });
  } catch (error) {
    return handle401(error);
  }
};

// ── WITHOUT TOKEN (public routes) ─────────────────────────────────────────────

export const noTokenGetRequest = async (url) => {
  const response = await axios.get(`${BASE_URL}${url}`);
  return response;
};

export const noTokenPostRequest = async ({ url, cred }) => {
  const response = await axios.post(`${BASE_URL}${url}`, cred);
  return response;
};

export const noTokenPutRequest = async ({ url, cred }) => {
  const response = await axios.put(`${BASE_URL}${url}`, cred);
  return response;
};

export const noTokenPatchRequest = async ({ url, cred }) => {
  const response = await axios.patch(`${BASE_URL}${url}`, cred);
  return response;
};

export const noTokenDeleteRequest = async (url) => {
  const response = await axios.delete(`${BASE_URL}${url}`);
  return response;
};

// ── File upload (multipart) ───────────────────────────────────────────────────
export const fileUpload = async ({ url, cred }) => {
  try {
    return await axios.post(`${BASE_URL}${url}`, cred, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    return handle401(error);
  }
};
