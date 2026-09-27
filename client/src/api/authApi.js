import { noTokenPostRequest, getRequest } from "../Helpers";

/**
 * POST /auth/register  (public)
 */
export const registerUserApi = (payload) =>
  noTokenPostRequest({ url: "/auth/register", cred: payload });

/**
 * POST /auth/login  (public)
 */
export const loginUserApi = (payload) =>
  noTokenPostRequest({ url: "/auth/login", cred: payload });

/**
 * GET /auth/profile  (protected)
 */
export const getProfileApi = () => getRequest("/auth/profile");
