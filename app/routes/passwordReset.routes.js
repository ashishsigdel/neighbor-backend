import { Router } from "express";

const router = Router();
import validate from "../validators/validate.js";
import {
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyOtpValidator,
} from "../validators/passwordReset.validators.js";
import * as passwordResetController from "../controllers/passwordReset.controller.js";

//endpoints
/**
 * @route POST /api/password-reset/forgot-password
 * @description Forgot password
 * @access Public
 */
router.post(
  "/forgot-password",
  forgotPasswordValidator(),
  validate,
  passwordResetController.forgotPassword
);

/**
 * @route POST /api/password-reset/verify-otp
 * @description Verify otp
 * @access Public
 */

router.post(
  "/verify-otp",
  verifyOtpValidator(),
  validate,
  passwordResetController.verifyOtp
);

/**
 * @route POST /api/password-reset/reset-password
 * @description Reset password
 * @access Public
 */
router.post(
  "/reset-password",
  resetPasswordValidator(),
  validate,
  passwordResetController.resetPassword
);

export default router;
