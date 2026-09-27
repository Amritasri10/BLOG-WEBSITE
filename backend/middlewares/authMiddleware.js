import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import User from "../models/User.modal.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      apiError(res, 401, false, "Unauthorized request: No token provided");
      return;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.userId).select(
      "-password -authToken"
    );

    if (!user) {
      apiError(res, 401, false, "Invalid access token: User not found");
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    apiError(res, 401, false, error?.message || "Invalid access token");
    return;
  }
});

export const authorizeRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return apiError(
          res,
          401,
          false,
          "Unauthorized access: No user data available"
        );
      }

      if (!allowedRoles.includes(req.user.role)) {
        return apiError(
          res,
          403,
          false,
          "Forbidden: You do not have access to this resource"
        );
      }

      next();
    } catch (error) {
      return apiError(res, 500, false, error.message || "Error in authorization");
    }
  };
};
