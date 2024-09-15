import { body } from "express-validator";
import db from "../models/index.js";
const { User } = db;
import {
  validatePassword,
  comparePassword,
} from "../services/passwordService.js";

/**
 * @function forgotPasswordValidator
 * @description Validates the forgot password request
 * @returns {ValidationChain[]} An array of validation chains
 * @example
 * router.post("/forgot-password", forgotPasswordValidator(), validate, forgotPassword);
 */
export const forgotPasswordValidator = () => {
  return [
    body("email")
      .exists()
      .withMessage("Email is required")
      .bail()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Email is invalid")
      .bail()
      .custom(async (email) => {
        const user = await User.findOne({
          where: { email },
        });
        if (!user) {
          return Promise.reject("Email does not exist");
        }
      }),
  ];
};

/**
 * @function verifyOtpValidator
 * @description Validates the verify otp request
 * @returns {ValidationChain[]} An array of validation chains
 * @example
 * router.post("/verify-otp", verifyOtpValidator(), validate, verifyOtp);
 */
export const verifyOtpValidator = () => {
  // verify reset token and otp
  return [
    body("resetToken") // reset token
      .exists()
      .withMessage("Reset token is required")
      .bail()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Reset token is required")
      .bail(),
    body("otp") // otp
      .exists()
      .withMessage("OTP is required")
      .bail()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("OTP is required")
      .bail()
      .isNumeric()
      .withMessage("OTP must be a number")
      .bail()
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
      .bail(),
  ];
};

/**
 * @function resetPasswordValidator
 * @description Validates the reset password request
 * @returns {ValidationChain[]} An array of validation chains
 * @example
 * router.post("/reset-password", resetPasswordValidator(), validate, resetPassword);
 */
export const resetPasswordValidator = () => {
  // resetToken, otp, password, confirmPassword
  return [
    body("resetToken") // reset token
      .exists()
      .withMessage("Reset token is required")
      .bail()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Reset token is required")
      .bail(),
    body("otp") // otp
      .exists()
      .withMessage("OTP is required")
      .bail()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("OTP is required")
      .bail()
      .isNumeric()
      .withMessage("OTP must be a number")
      .bail()
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
      .bail(),
    body("password")
      .exists() // check if password exists
      .withMessage("Password is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if password is not empty
      .withMessage("Password is required")
      .bail() // stop validation chain if any of the above fails
      .isLength({ min: 8 }) // check if password is atleast 6 characters long
      .withMessage("Password should be atleast 8 characters long")
      .bail() // stop validation chain if any of the above fails
      .custom((value) => {
        // check if password is valid
        if (!validatePassword(value)) {
          throw new Error(
            "Password must be greater than 8 characters, contain both uppercase and lowercase letters, include digits, and should not have any spaces."
          );
        }
        return true;
      }),
    body("confirmPassword")
      .exists() // check if confirmPassword exists
      .withMessage("Confirm password is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if confirmPassword is not empty
      .withMessage("Confirm password is required")
      .bail() // stop validation chain if any of the above fails
      .custom((value, { req }) => {
        // check if confirmPassword matches password
        if (value !== req.body.password) {
          throw new Error("Confirm password does not match");
        }
        return true;
      }),
  ];
};
