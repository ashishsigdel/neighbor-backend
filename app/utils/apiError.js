import errorHanlerMiddleware from "../middlewares/error.middleware.js";

/**
 * @class ApiError
 * @extends Error
 * @description Custom error class for API errors
 * The {@link errorHanlerMiddleware} will catch this error and send the response
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 * @param {array} errors - Array of errors
 * @param {string} stack - Error stack
 * @returns {ApiError} - An instance of ApiError
 */
class ApiError extends Error {
  constructor({
    status = 500,
    message = "Something went wrong",
    data = null,
    errors = null,
    stack = "",
  }) {
    super(message);
    this.status = status;
    if (data) this.data = data;
    this.message = message;
    if (errors) this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
