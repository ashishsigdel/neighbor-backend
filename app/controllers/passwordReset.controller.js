import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { comparePassword, hashPassword } from "../services/passwordService.js";
import logger from "../utils/logger.js";
import { sendEmail } from "../services/emailService.js";
import { generateOTP } from "../utils/helper.js";
import { getOtpTemplate } from "../utils/htmlTemplateUtils.js";
import { v4 as uuidv4 } from "uuid";

const {
  Op,
  User,
  Role,
  UserProfile,
  RefreshToken,
  EmailVerification,
  FcmToken,
  LoginHistory,
  PasswordReset,
} = db;

import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

/**
 * @description     Forgot password
 * @route           POST prefix/password-reset/forgot-password
 * @access          Public
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /password-reset/forgot-password
 *      body:
 *         {
 *            "email": "kadhikari@softup.io",
 *         }
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  //get user of email
  const user = await User.findOne({
    where: {
      email,
    },
    include: [
      {
        model: UserProfile,
        as: "userProfile",
        attributes: {
          exclude: ["id", "userId", "updatedAt", "deletedAt"],
        },
      },
    ],
  });

  //get total password resets request for the day
  const now = new Date();
  const previousRequestCount = await PasswordReset.count({
    where: {
      userId: user.id,
      createdAt: {
        [Op.gte]: new Date(now - 24 * 60 * 60 * 1000),
      },
    },
  });

  // if previous request count is greater or equal to 5, throw error
  if (previousRequestCount >= 5) {
    throw new ApiError({
      message: "Too many attempts. Please try again later",
      status: 429,
    });
  }

  //get latest password reset
  const passwordReset = await PasswordReset.findOne({
    where: {
      userId: user.id,
    },
    order: [["createdAt", "DESC"]],
  });

  // check if the latest password reset is less than 1 minute old
  if (
    passwordReset &&
    passwordReset.createdAt > new Date(now - 60 * 1000) // 1 minute
  ) {
    throw new ApiError({
      message: "Too many attempts. Please try again later",
      status: 429,
    });
  }

  //generate otp
  const otp = generateOTP(6);

  // generate reset token
  const resetToken = uuidv4();

  //hash otp
  const otpHash = await hashPassword(otp);

  //set all password reset request as expired
  await PasswordReset.update(
    {
      isUsed: true,
    },
    {
      where: {
        userId: user.id,
      },
    }
  );

  //create new password reset request
  const newResetRequest = await PasswordReset.create({
    userId: user.id,
    resetToken,
    otp: otpHash,
    expiresAt: new Date(now.getTime() + 5 * 60 * 1000), // 5 minutes
  });

  //send otp to user email
  try {
    const emailContent = getOtpTemplate({
      greetings: `Dear ${user.userProfile.fullName.split(" ")[0]},`,
      title:
        "Please use the One Time Password (OTP) provided below to reset your password.",
      otp: otp,
      description:
        "Note: The above OTP will expire in next five minutes. Once expired, you have to regenerate another otp.",
    });

    await sendEmail({
      fromAddress: process.env.EMAIL_FROM_ADDRESS,
      fromName: process.env.EMAIL_FROM_NAME,
      to: email,
      subject: "Password Reset - Chhimekee",
      html: emailContent,
    });
  } catch (error) {
    logger.error(error);
  }

  //send response
  return new ApiResponse({
    status: 200,
    message: "OTP sent to your email address",
    data: {
      resetToken: resetToken,
    },
  }).send(res);
});

/**
 * @description     Verify otp
 * @route           POST prefix/password-reset/verify-otp
 * @access          Public
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /password-reset/verify-otp
 *     body:
 *        {
 *            "resetToken": "f1b9a0e0-9b1e-4b5a-8b9a-0e09b1e4b5a8",
 *           "otp": "123456"
 *       }
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { resetToken, otp } = req.body;

  //get password reset request
  const passwordReset = await PasswordReset.findOne({
    where: {
      resetToken,
    },
  });

  //check if password reset request exists
  if (!passwordReset) {
    throw new ApiError({
      message: "Invalid reset token",
      errors: [
        {
          resetToken: "Invalid reset token",
        },
      ],
      status: 404,
    });
  }

  // check password reset attempts
  if (passwordReset.attempts >= 5) {
    throw new ApiError({
      message: "Too many attempts. Please try again later",
      status: 429,
    });
  }

  // check if otp is used
  if (passwordReset.isUsed) {
    throw new ApiError({
      message: "OTP has already been used",
      errors: [
        {
          otp: "OTP has already been used",
        },
      ],
      status: 400,
    });
  }

  // check if otp is expired
  if (passwordReset.expiresAt < new Date()) {
    throw new ApiError({
      message: "OTP has expired",
      errors: [
        {
          otp: "OTP has expired",
        },
      ],
      status: 400,
    });
  }

  // increment attempts
  passwordReset.attempts += 1;
  await passwordReset.save();

  // compare otp
  const isMatch = await comparePassword(otp, passwordReset.otp);

  // if otp is not matched
  if (!isMatch) {
    throw new ApiError({
      message: "Invalid OTP",
      errors: [
        {
          otp: "Invalid OTP",
        },
      ],
      status: 400,
    });
  }

  //send response
  return new ApiResponse({
    status: 200,
    message: "OTP verified",
  }).send(res);
});

/**
 * @description     Reset password
 * @route           POST prefix/password-reset/reset-password
 * @access          Public
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /password-reset/reset-password
 *    body:
 *      {
 *          "resetToken": "f1b9a0e0-9b1e-4b5a-8b9a-0e09b1e4b5a8",
 *          "otp": "123456",
 *          "password": "123456",
 *          "confirmPassword": "123456"
 *     }
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, otp, password } = req.body;

  //get password reset request
  const passwordReset = await PasswordReset.findOne({
    where: {
      resetToken,
    },
  });

  //check if password reset request exists
  if (!passwordReset) {
    throw new ApiError({
      message: "Invalid reset token",
      errors: [
        {
          resetToken: "Invalid reset token",
        },
      ],
      status: 404,
    });
  }

  // check password reset attempts
  if (passwordReset.attempts >= 5) {
    throw new ApiError({
      message: "Too many attempts. Please try again later",
      status: 429,
    });
  }

  // check if otp is used
  if (passwordReset.isUsed) {
    throw new ApiError({
      message: "OTP has already been used",
      errors: [
        {
          otp: "OTP has already been used",
        },
      ],
      status: 400,
    });
  }

  // check if otp is expired
  if (passwordReset.expiresAt < new Date()) {
    throw new ApiError({
      message: "OTP has expired",
      errors: [
        {
          otp: "OTP has expired",
        },
      ],
      status: 400,
    });
  }

  // increment attempts
  passwordReset.attempts += 1;
  await passwordReset.save();

  // compare otp
  const isMatch = await comparePassword(otp, passwordReset.otp);

  // if otp is not matched
  if (!isMatch) {
    throw new ApiError({
      message: "Invalid OTP",
      errors: [
        {
          otp: "Invalid OTP",
        },
      ],
      status: 400,
    });
  }

  // check if user exists
  const user = await User.findOne({
    where: {
      id: passwordReset.userId,
    },
  });

  // if user does not exist
  if (!user) {
    throw new ApiError({
      message: "User does not exist",
      status: 404,
    });
  }

  // check if password is same as previous password
  const isSamePassword = await comparePassword(password, user.password);

  // if password is same as previous password
  if (isSamePassword) {
    throw new ApiError({
      message: "Password cannot be same as previous password",
      errors: [
        {
          password: "Password cannot be same as previous password",
        },
      ],
      status: 400,
    });
  }

  // hash password
  const passwordHash = await hashPassword(password);

  // update user password
  user.password = passwordHash;
  await user.save();

  // update password reset request
  passwordReset.isUsed = true;
  passwordReset.passwordChangedAt = new Date();
  await passwordReset.save();

  //delete all refresh tokens
  await RefreshToken.destroy({
    where: {
      userId: user.id,
    },
    force: true,
  });

  //delete all fcm tokens
  await FcmToken.destroy({
    where: {
      userId: user.id,
    },
    force: true,
  });

  //send response
  return new ApiResponse({
    status: 200,
    message: "Password reset successfully",
  }).send(res);
});
