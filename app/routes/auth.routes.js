import { Router } from "express";

const router = Router();
import validate from "../validators/validate.js";
import {
  loginValidator,
  registerValidator,
  verifyEmailValidator,
  resendEmailVerificationValidator,
  refreshAccessTokenValidator,
} from "../validators/user.validators.js";
import * as authController from "../controllers/auth.controller.js";

//routes for auth

/**
 * @route POST /api/auth/register
 * @description Register user
 * @access Public
 */
router.post(
  "/register",
  registerValidator(),
  validate,
  authController.register
);

/**
 * @route POST /api/auth/login
 * @description Login user
 * @access Public
 */
router.post("/login", loginValidator(), validate, authController.login);

/**
 * @route POST /api/auth/refresh-token
 * @description Refresh token
 * @access Public
 */
router.post(
  "/refresh-token",
  refreshAccessTokenValidator(),
  validate,
  authController.refreshAccessToken
);

/**
 * @route POST /api/auth/verify-email
 * @description Verify email
 * @access Public
 */
router.post(
  "/verify-email",
  verifyEmailValidator(),
  validate,
  authController.verifyEmail
);

/**
 * @route POST /api/auth/resend-email-verification
 * @description Resend email verification
 * @access Public
 */
router.post(
  "/resend-email-verification",
  resendEmailVerificationValidator(),
  validate,
  authController.resendEmailVerification
);

/**
 * @route POST /api/auth/logout
 * @description Logout
 * @access Private
 */
router.post("/logout", authController.logout);

/**
 * @route POST /api/auth/logout-all
 * @description Logout all
 * @access Private
 */
router.post("/logout-all", authController.logoutAll);

export default router;
