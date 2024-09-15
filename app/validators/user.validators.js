import { body } from "express-validator";
import db from "../models/index.js";
const { User, Op } = db;
import {
  validatePassword,
  comparePassword,
} from "../services/passwordService.js";
import DeviceType from "../enums/deviceType.js";
import Gender from "../enums/gender.js";

/**
 * @function registerValidator
 * @description This is the validator for the register route
 * @returns {ValidationChain[]} An array of ValidationChain
 * @example
 * router.post("/register", registerValidator(), validate, authController.register);
 */
export const registerValidator = () => {
  //validate fullName, email, password and confirmPassword
  return [
    body("fullName")
      .exists() // check if fullName exists
      .withMessage("Full name is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if fullName is not empty
      .withMessage("Full name is required")
      .bail() // stop validation chain if any of the above fails
      .isLength({ min: 3 }) // check if fullName is atleast 3 characters long
      .withMessage("Full name should be atleast 3 characters long")
      .bail() // stop validation chain if any of the above fails
      .matches(/^[a-zA-Z ]*$/) // check if fullName contains only alphabets and spaces
      .withMessage("Full name should contain only alphabets and spaces")
      .bail(), // stop validation chain if any of the above fails
    body("email")
      .exists() // check if email exists
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if email is not empty
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .isEmail() // check if email is valid
      .withMessage("Email is invalid")
      .bail() // stop validation chain if any of the above fails
      .custom(async (value) => {
        // check if email already exists
        const user = await User.findOne({ where: { email: value } });
        if (user) {
          throw new Error("Email already exists");
        }
        return true;
      }),
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

/**
 * @function loginValidator
 * @description This is the validator for the login route
 * @returns {ValidationChain[]} An array of ValidationChain
 * @example
 * router.post("/login", loginValidator(), validate, authController.login);
 */
export const loginValidator = () => {
  //validate email and password
  return [
    body("email")
      .exists() // check if email exists
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if email is not empty
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .isEmail() // check if email is valid
      .withMessage("Email is invalid")
      .bail(), // stop validation chain if any of the above fails
    body("password")
      .exists() // check if password exists
      .withMessage("Password is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if password is not empty
      .withMessage("Password is required")
      .bail(), // stop validation chain if any of the above fails
    body("device")
      .exists() // check if device exists
      .withMessage("Device information is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if device is not empty
      .withMessage("Device information is required")
      .bail() // stop validation chain if any of the above fails
      .isLength({ min: 3 }) // check if device is atleast 3 characters long
      .withMessage("Device information should be atleast 3 characters long")
      .bail(), // stop validation chain if any of the above fails
    body("deviceType")
      .exists() // check if deviceType exists
      .withMessage("Device type is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if deviceType is not empty
      .withMessage("Device type is required")
      .bail() // stop validation chain if any of the above fails
      .isIn(Object.values(DeviceType)) // check if deviceType is valid
      .withMessage("Device type is invalid")
      .bail(), // stop validation chain if any of the above fails
  ];
};

/**
 * @function verifyEmailValidator
 * @description This is the validator for the verify-email route
 * @returns {ValidationChain[]} An array of ValidationChain
 * @example
 * router.post("/verify-email", verifyEmailValidator(), validate, authController.verifyEmail);
 */
export const verifyEmailValidator = () => {
  return [
    body("otp")
      .exists() // check if otp exists
      .withMessage("OTP is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if otp is not empty
      .withMessage("OTP is required")
      .bail() // stop validation chain if any of the above fails
      .isNumeric() // check if otp is numeric
      .withMessage("OTP should be numeric")
      .bail() // stop validation chain if any of the above fails
      .isLength({ min: 6, max: 6 }) // check if otp is 6 characters long
      .withMessage("OTP should be 6 characters long")
      .bail(), // stop validation chain if any of the above fails
    body("email")
      .exists() // check if email exists
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if email is not empty
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .isEmail() // check if email is valid
      .withMessage("Email is invalid")
      .bail(), // stop validation chain if any of the above fails
    body("device")
      .exists() // check if device exists
      .withMessage("Device information is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if device is not empty
      .withMessage("Device information is required")
      .bail() // stop validation chain if any of the above fails
      .isLength({ min: 3 }) // check if device is atleast 3 characters long
      .withMessage("Device information should be atleast 3 characters long")
      .bail(), // stop validation chain if any of the above fails
    body("deviceType")
      .exists() // check if deviceType exists
      .withMessage("Device type is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if deviceType is not empty
      .withMessage("Device type is required")
      .bail() // stop validation chain if any of the above fails
      .isIn(Object.values(DeviceType)) // check if deviceType is valid
      .withMessage("Device type is invalid")
      .bail(), // stop validation chain if any of the above fails
  ];
};

/**
 * @function resendEmailVerificationValidator
 * @description This is the validator for the resend-email-verification route
 * @returns {ValidationChain[]} An array of ValidationChain
 * @example
 * router.post("/resend-email-verification", resendEmailVerificationValidator(), validate, authController.resendEmailVerification);
 */
export const resendEmailVerificationValidator = () => {
  return [
    body("email")
      .exists() // check if email exists
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if email is not empty
      .withMessage("Email is required")
      .bail() // stop validation chain if any of the above fails
      .isEmail() // check if email is valid
      .withMessage("Email is invalid")
      .bail(), // stop validation chain if any of the above fails
  ];
};

/**
 * @function refreshAccessTokenValidator
 * @description This is the validator for the refresh-token route
 * @returns {ValidationChain[]} An array of ValidationChain
 * @example
 * router.post("/refresh-token", refreshAccessTokenValidator(), authController.refreshAccessToken);
 */
export const refreshAccessTokenValidator = () => {
  return [
    body("device")
      .exists() // check if device exists
      .withMessage("Device information is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if device is not empty
      .withMessage("Device information is required")
      .bail() // stop validation chain if any of the above fails
      .isLength({ min: 3 }) // check if device is atleast 3 characters long
      .withMessage("Device information should be atleast 3 characters long")
      .bail(), // stop validation chain if any of the above fails
    body("deviceType")
      .exists() // check if deviceType exists
      .withMessage("Device type is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if deviceType is not empty
      .withMessage("Device type is required")
      .bail() // stop validation chain if any of the above fails
      .isIn(Object.values(DeviceType)) // check if deviceType is valid
      .withMessage("Device type is invalid")
      .bail(), // stop validation chain if any of the above fails
  ];
};

/**
 * @function updateProfileValidator
 * @description This is the validator for the /users/profile route
 * @returns {ValidationChain[]} An array of ValidationChain
 * @example
 * router.put("/profile", updateProfileValidator(), validate, userController.updateProfile);
 */
export const updateProfileValidator = () => {
  return [
    body("username")
      .optional() // make field optional
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty() // check if username is not empty
      .withMessage("Username is required")
      .bail() // stop validation chain if any of the above fails
      .isLength({ min: 4 }) // check if username is atleast 4 characters long
      .withMessage("Username should be atleast 4 characters long")
      .bail() // stop validation chain if any of the above fails
      .isLength({ max: 20 }) // check if username is atmost 20 characters long
      .withMessage("Username should be atmost 20 characters long")
      .bail() // stop validation chain if any of the above fails
      .matches(/^[a-zA-Z0-9_.]*$/) // check if username contains only alphanumeric characters, underscore and dot
      .withMessage(
        "Username should contain only alphanumeric characters, underscore and dot"
      )
      .bail() // stop validation chain if any of the above fails
      .custom(async (value, { req }) => {
        // check if username already exists and is not the same as the current username
        const user = await User.findOne({
          where: {
            username: value,
            [Op.not]: [{ id: req.user.id }],
          },
        });

        if (user) {
          throw new Error("Username is unavailable");
        }

        return true;
      }),
    body("fullName")
      .optional() // make field optional
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .isLength({ min: 3 }) // check if fullName is atleast 3 characters long
      .withMessage("Full name should be atleast 3 characters long")
      .bail() // stop validation chain if any of the above fails
      .matches(/^[a-zA-Z ]*$/) // check if fullName contains only alphabets and spaces
      .withMessage("Full name should contain only alphabets and spaces")
      .bail() // stop validation chain if any of the above fails
      .custom((value) => {
        // check characters for minimum first and last name
        const names = value.split(" ");
        if (names.length < 2) {
          throw new Error(
            "Full name should contain at least first and last name"
          );
        }
        return true;
      }),
    body("phone")
      .optional() // make field optional
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .isMobilePhone("any") // check if phone is valid
      .withMessage("Phone number is invalid")
      .bail(), // stop validation chain if any of the above fails
    body("gender")
      .optional() // make field optional
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .notEmpty()
      .withMessage("Gender is required")
      .bail() // stop validation chain if any of the above fails
      .custom((value) => {
        // check if gender is included in Gender enum
        let isGenderValid = false;

        for (const key of Object.keys(Gender)) {
          if (Gender[key] === value) {
            isGenderValid = true;
            break;
          }
        }

        if (!isGenderValid) {
          throw new Error("Gender is invalid");
        }

        return true;
      }),
    body("dob")
      .optional() // make field optional
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .isDate() // check if dob is valid date
      .withMessage("Date of birth is invalid")
      .bail(), // stop validation chain if any of the above fails
    body("bio")
      .optional() // make field optional
      .trim() // trim leading and trailing white spaces
      .escape() // sanitize input
      .isLength({ min: 3 }) // check if bio is atleast 3 characters long
      .withMessage("Bio should be atleast 3 characters long")
      .bail() // stop validation chain if any of the above fails
      .isLength({ max: 200 }) // check if bio is atmost 200 characters long
      .withMessage("Bio should be atmost 200 characters long")
      .bail(), // stop validation chain if any of the above fails
  ];
};

/**
 * @function changePasswordValidator
 * @description This is the validator for the /users/change-password route
 * @returns {ValidationChain[]} An array of ValidationChain
 * @example
 * router.put("/change-password", changePasswordValidator(), validate, userController.changePassword);
 */

export const changePasswordValidator = () => {
  return [
    body("oldPassword")
      .exists() // check if oldPassword exists
      .withMessage("Current password is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .notEmpty() // check if oldPassword is not empty
      .withMessage("Current password is required")
      .bail() // stop validation chain if any of the above fails
      .escape() // sanitize input
      .custom(async (value, { req }) => {
        // check if oldPassword is valid
        const user = await User.findByPk(req.user.id);
        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await comparePassword(value, user.password);

        if (!isMatch) {
          throw new Error("Current password is incorrect");
        }

        return true;
      }),
    body("newPassword")
      .exists() // check if newPassword exists
      .withMessage("New password is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .notEmpty() // check if newPassword is not empty
      .withMessage("New password is required")
      .bail() // stop validation chain if any of the above fails
      .escape() // sanitize input
      .custom((value, { req }) => {
        // check if newPassword is valid
        if (!validatePassword(value)) {
          throw new Error(
            "New password must be greater than 8 characters, contain both uppercase and lowercase letters, include digits, and should not have any spaces."
          );
        }

        //check if newPassword is same as oldPassword
        if (value === req.body.oldPassword) {
          throw new Error("New password cannot be same as current password");
        }

        return true;
      }),
    body("confirmPassword")
      .exists() // check if confirmPassword exists
      .withMessage("Confirm password is required")
      .bail() // stop validation chain if any of the above fails
      .trim() // trim leading and trailing white spaces
      .notEmpty() // check if confirmPassword is not empty
      .withMessage("Confirm password is required")
      .bail() // stop validation chain if any of the above fails
      .escape() // sanitize input
      .custom((value, { req }) => {
        // check if confirmPassword matches newPassword
        if (value !== req.body.newPassword) {
          throw new Error("Confirm password does not match");
        }
        return true;
      }),
  ];
};
