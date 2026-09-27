import { apiResponse } from "../utils/apiResponse.js";

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res
      .status(403)
      .json(new apiResponse(403, null, "Access denied: Admin only"));
  }
  next();
};

export { isAdmin };
