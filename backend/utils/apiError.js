export const apiError = (res, statusCode, status, message) => {
  return res.status(statusCode).json({
    status,
    message,
  });
};
