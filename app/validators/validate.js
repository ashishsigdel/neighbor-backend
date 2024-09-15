import { validationResult } from "express-validator";
import errorHanlerMiddleware from "../middlewares/error.middleware.js";
import ApiError from "../utils/apiError.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @description This is the validate middleware responsible to centralize the error checking done by the `express-validator` `ValidationChains`.
 * This checks if the request validation has errors.
 * If yes then it structures them and throws an {@link ApiError} which forwards the error to the {@link errorHanlerMiddleware} middleware which throws a uniform response at a single place
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];

  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  throw new ApiError({
    message: errors.array()[0].msg,
    errors: extractedErrors,
    status: 422,
  });
};

export default validate;
