import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { removeUnusedMulterImageFilesOnError } from "../utils/helper.js";
import logger from "../utils/logger.js";

/**
 * @function errorHanlerMiddleware
 * @description Error handler middleware
 * @param {object} err - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @returns {ApiResponse} - An instance of ApiResponse
 */

const errorHanlerMiddleware = async (err, req, res, next) => {
  let error = err;

  // check if error is an instance of ApiError
  if (!(error instanceof ApiError)) {
    error = new ApiError({
      status: 500,
      message: "Something went wrong",
      errors: error.errors,
      stack: err,
    });
  }

  // send error response by modifying the response objec, show error stack in development
  const response = {
    ...error,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  removeUnusedMulterImageFilesOnError(req);

  logger.error(err);

  return res.status(error.status).json(response);
};

export default errorHanlerMiddleware;
