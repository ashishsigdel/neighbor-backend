import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { comparePassword, hashPassword } from "../services/passwordService.js";
import logger from "../utils/logger.js";
import { sendEmail } from "../services/emailService.js";
import { generateOTP } from "../utils/helper.js";

import { getOtpTemplate } from "../utils/htmlTemplateUtils.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getAuthToken,
  getCookieToken,
  verifyToken,
} from "../utils/jwtUtil.js";

const {
  Op,
  User,
  Role,
  UserProfile,
  RefreshToken,
  EmailVerification,
  FcmToken,
  LoginHistory,
  Media,
} = db;

import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

/**
 * @desc    Register user
 * @route   POST prefix/auth/register
 * @access  Public
 * @param   {Object} req - request object
 * @param   {Object} res - response object
 * @returns {Object} - return response object
 * @example /auth/register
 *         body:
 *         {
 *            "fullName": "Krishna Adhikari",
 *            "email": "kadhikari@softup.io",
 *            "password": "12345678",
 *            "confirmPassword": "12345678"
 *         }
 */
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // get user role - throw error if not found
  const userRole = await Role.findOne({ where: { title: "user" } });

  if (!userRole) {
    throw new ApiError({
      message: "User role not found",
      status: 404,
    });
  }

  //encrypt password
  const hashedPassword = await hashPassword(password);

  //generate username from email
  let username = email.split("@")[0];

  // validate username
  const isUsernameAlreadyExists = await User.findOne({
    where: { username: username },
  });

  if (isUsernameAlreadyExists) {
    // if username already exists, append id that come next to username
    const lastUser = await User.findOne({
      order: [["id", "DESC"]],
    });

    const lastUserId = lastUser.id;

    const newUsername = `${username}${lastUserId + 1}`;

    //set username
    username = newUsername;
  }

  //create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  //set user role
  await user.setRoles([userRole]);

  // create user profile with user id and fullName
  await UserProfile.create({
    fullName,
    userId: user.id,
  });

  const otp = generateOTP(6);

  //hash otp and save it to db
  const hashedOtp = await hashPassword(otp);

  //save otp to db
  await EmailVerification.create({
    userId: user.id,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), //expires in 5 minutes
  });

  //send otp to user email
  try {
    const emailContent = getOtpTemplate({
      greetings: `Dear ${fullName.split(" ")[0]},`,
      title:
        "Please use the One Time Password (OTP) provided below to verify your email address:",
      otp: otp,
      description:
        "Note: The above OTP will expire in next five minutes. Once expired, you have to regenerate another otp.",
    });

    await sendEmail({
      fromAddress: process.env.EMAIL_FROM_ADDRESS,
      fromName: process.env.EMAIL_FROM_NAME,
      to: email,
      subject: "Email verification - Chhimekee",
      html: emailContent,
    });
  } catch (error) {
    logger.error(error);
  }

  //send response
  return new ApiResponse({
    status: 201,
    message: "User registered successfully",
  }).send(res);
});

/**
 * @desc    Login user with email and password
 * @route   POST prefix/auth/login
 * @access  Public
 * @param   {Object} req - request object
 * @param   {Object} res - response object
 * @returns {Object} - return response object
 * @example /auth/login
 *        body:
 *        {
 *         "email": "kadhikari@softup.io",
 *         "password": "12345678"
 *        }
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password, deviceType, device } = req.body;

  //check if user exists
  const user = await User.findOne({
    where: { email: email },
    include: [
      {
        model: Role,
        as: "roles",
        attributes: ["title"],
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    throw new ApiError({
      message: "Invalid credentials",
      status: 401,
    });
  }

  //match password
  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError({
      message: "Invalid credentials",
      status: 401,
    });
  }

  //check if user email is verified
  if (!user.isEmailVerified) {
    throw new ApiError({
      message: "Email not verified",
      status: 403,
      errors: [
        {
          email: "Email not verified",
        },
      ],
    });
  }

  //check if user is enabled
  if (!user.isEnabled) {
    throw new ApiError({
      message: "User is not enabled",
      status: 401,
      errors: [
        {
          enabled: "User is not enabled",
        },
      ],
    });
  }

  //check if user is locked
  if (user.isAccountLocked) {
    throw new ApiError({
      message: "User is locked",
      status: 401,
      errors: [
        {
          locked: "User is locked",
        },
      ],
    });
  }

  //check if user credentials is expired
  if (user.isCredentialsExpired) {
    throw new ApiError({
      message: "User credentials is expired",
      status: 401,
      errors: [
        {
          credentialsExpired: "User credentials is expired",
        },
      ],
    });
  }

  // generate refresh token
  const refreshToken = generateRefreshToken({
    userId: user.id,
    roles: user.roles,
  });

  // save refresh token
  const savedRefreshToken = await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(
      Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 60 * 1000
    ), // converts minutes to milliseconds and add to current date
  });

  // generate access token
  const accessToken = generateAccessToken({
    userId: user.id,
    roles: user.roles,
    refreshTokenId: savedRefreshToken.id,
  });

  //update user last login
  await User.update(
    {
      lastLoggedInAt: new Date(),
    },
    {
      where: { id: user.id },
    }
  );

  let responseData = {
    accessToken,
    user: await User.findOne({
      where: { id: user.id },
      attributes: ["id", "username", "email"],
      include: [
        {
          model: Role,
          as: "roles",
          attributes: {
            exclude: [
              "id",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "description",
            ],
          },
          through: { attributes: [] },
        },
        {
          model: UserProfile,
          as: "userProfile",
          include: [
            {
              model: Media,
              as: "profilePicture",
              attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
            },
            {
              model: Media,
              as: "coverPicture",
              attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
            },
          ],
          attributes: {
            exclude: [
              "id",
              "userId",
              "updatedAt",
              "deletedAt",
              "profilePictureId",
              "coverPictureId",
            ],
          },
        },
      ],
    }),
  };

  //set cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  //store login history
  await LoginHistory.findOrCreate({
    where: {
      userId: user.id,
      ipAddress: req.clientIp,
      userAgent: req.headers["user-agent"],
      device: device,
      deviceType: deviceType,
    },
    defaults: {
      userId: user.id,
      ipAddress: req.clientIp,
      userAgent: req.headers["user-agent"],
      device: device,
      deviceType: deviceType,
    },
  });

  return new ApiResponse({
    status: 200,
    message: "User logged in successfully",
    data: responseData,
  }).send(res);
});

/**
 * @desc    Refresh access token
 * @route   POST prefix/auth/refresh-token
 * @access  Private
 * @param   {Object} req - request object
 * @param   {Object} res - response object
 * @returns {Object} - return response object
 * @example /auth/refresh-token
 *       body: {}
 *       headers:
 *          {
 *            "Authorization": "Bearer <expired_access_token>",
 *          }
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = getCookieToken(req) || getAuthToken(req);
  const { deviceType, device } = req.body;

  if (!token) {
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }

  //verify token
  try {
    const decodedToken = verifyToken({
      token: token,
      ignoreExpiration: true,
    });

    //get refresh token from db
    const refreshToken = await RefreshToken.findOne({
      where: {
        id: decodedToken.rfId,
        userId: decodedToken.id,
      },
    });

    if (!refreshToken) {
      throw new ApiError({
        message: "Unauthorized",
        status: 401,
      });
    }

    // verify refresh token
    verifyToken({
      token: refreshToken.token,
    });

    //get user from db
    const user = await User.findOne({
      where: { id: decodedToken.id },
      attributes: ["id", "username", "email"],
      include: [
        {
          model: Role,
          as: "roles",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "deletedAt"],
          },
          through: { attributes: [] },
        },
        {
          model: UserProfile,
          as: "userProfile",
          include: [
            {
              model: Media,
              as: "profilePicture",
              attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
            },
            {
              model: Media,
              as: "coverPicture",
              attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
            },
          ],
          attributes: {
            exclude: [
              "id",
              "userId",
              "updatedAt",
              "deletedAt",
              "profilePictureId",
              "coverPictureId",
            ],
          },
        },
      ],
    });

    if (!user) {
      throw new ApiError({
        message: "Unauthorized",
        status: 401,
      });
    }

    //generate access token
    const accessToken = generateAccessToken({
      userId: user.id,
      roles: user.roles,
      refreshTokenId: refreshToken.id,
    });

    // replace old refresh token with new one in cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    let responseData = {
      accessToken,
      user,
    };

    //store login history
    await LoginHistory.findOrCreate({
      where: {
        userId: user.id,
        ipAddress: req.clientIp,
        userAgent: req.headers["user-agent"],
        device: device,
        deviceType: deviceType,
      },
      defaults: {
        userId: user.id,
        ipAddress: req.clientIp,
        userAgent: req.headers["user-agent"],
        device: device,
        deviceType: deviceType,
      },
    });

    return new ApiResponse({
      status: 200,
      message: "Access token refreshed successfully",
      data: responseData,
    }).send(res);
  } catch (error) {
    logger.error(error);
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }
});

/**
 * @desc    Verify Email using OTP
 * @route   POST prefix/auth/verify-email
 * @access  Public
 * @param   {Object} req - request object
 * @param   {Object} res - response object
 * @returns {Object} - return response object
 * @example /auth/verify-email
 *       body:
 *       {
 *          "email": "kadhikari@softup.io",
 *          "otp": "123456"
 *       }
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp, device, deviceType } = req.body;

  //get user
  const user = await User.findOne({
    where: { email: email },
    attributes: ["id", "username", "email", "isEmailVerified", "isEnabled"],
    include: [
      {
        model: Role,
        as: "roles",
        attributes: {
          exclude: ["id", "createdAt", "updatedAt", "deletedAt", "description"],
        },
        through: { attributes: [] },
      },
      {
        model: UserProfile,
        as: "userProfile",
        include: [
          {
            model: Media,
            as: "profilePicture",
            attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
          },
          {
            model: Media,
            as: "coverPicture",
            attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
          },
        ],
        attributes: {
          exclude: [
            "id",
            "userId",
            "updatedAt",
            "deletedAt",
            "profilePictureId",
            "coverPictureId",
          ],
        },
      },
    ],
  });

  if (!user) {
    throw new ApiError({
      message: "User not found",
      status: 404,
    });
  }

  //check if user email is verified
  if (user.isEmailVerified) {
    throw new ApiError({
      message: "Email already verified",
      errors: [
        {
          isEmailVerified: "Email already verified",
        },
      ],
      status: 400,
    });
  }

  // get latest email verification record
  const emailVerification = await EmailVerification.findOne({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });

  if (!emailVerification) {
    throw new ApiError({
      message: "Invalid OTP",
      errors: [
        {
          otp: "Invalid OTP",
        },
      ],
      status: 404,
    });
  }

  // check if attempts is greater than 5
  if (emailVerification.attempts >= 5) {
    throw new ApiError({
      message: "Too many attempts. Please try again later",
      errors: [
        {
          otp: "Too many attempts. Please try again later",
        },
      ],
      status: 429,
    });
  }

  //increase attempts by 1
  await EmailVerification.update(
    {
      attempts: emailVerification.attempts + 1,
    },
    {
      where: { id: emailVerification.id },
    }
  );

  //check if otp is already verified
  if (emailVerification.verifiedAt) {
    throw new ApiError({
      message: "OTP already used",
      errors: [
        {
          otp: "OTP already used",
        },
      ],

      status: 400,
    });
  }

  //check if otp is expired
  if (emailVerification.expiresAt < new Date()) {
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

  //check if otp is valid
  const isOtpValid = await comparePassword(otp, emailVerification.otp);

  if (!isOtpValid) {
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

  //update otp verifiedAt
  await EmailVerification.update(
    {
      verifiedAt: new Date(),
    },
    {
      where: { id: emailVerification.id },
    }
  );

  //generate refresh token
  const refreshToken = generateRefreshToken({
    userId: user.id,
    roles: user.roles,
  });

  //save refresh token
  const savedRefreshToken = await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(
      Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN) * 60 * 1000
    ), // converts minutes to milliseconds and add to current date
  });

  //generate access token
  const accessToken = generateAccessToken({
    userId: user.id,
    roles: user.roles,
    refreshTokenId: savedRefreshToken.id,
  });

  //update user last login, isEmailVerified, isEnabled
  await User.update(
    { isEmailVerified: true, isEnabled: true, lastLoggedInAt: new Date() },
    {
      where: { id: user.id },
    }
  );

  let responseData = {
    accessToken,
    user,
  };

  //set cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  //store login history
  await LoginHistory.findOrCreate({
    where: {
      userId: user.id,
      ipAddress: req.clientIp,
      userAgent: req.headers["user-agent"],
      device: device,
      deviceType: deviceType,
    },
    defaults: {
      userId: user.id,
      ipAddress: req.clientIp,
      userAgent: req.headers["user-agent"],
      device: device,
      deviceType: deviceType,
    },
  });

  return new ApiResponse({
    status: 200,
    message: "Email verified successfully",
    data: responseData,
  }).send(res);
});

/**
 * @desc    Resend email verification
 * @route   POST prefix/auth/resend-email-verification
 * @access  Public
 * @param   {Object} req - request object
 * @param   {Object} res - response object
 * @returns {Object} - return response object
 * @example /auth/resend-email-verification
 *        body:
 *       {
 *         "email": "test@test.com",
 *       }
 */
export const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: { email: email },
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

  if (!user) {
    throw new ApiError({
      message: "User not found",
      status: 404,
    });
  }

  //check if email is already verified
  if (user.isEmailVerified) {
    throw new ApiError({
      message: "Email already verified",
      status: 400,
    });
  }

  //check if user has exceeded max attempts
  const now = new Date();
  const previousRequestCount = await EmailVerification.count({
    where: {
      userId: user.id,
      createdAt: {
        [Op.gte]: new Date(now - 24 * 60 * 60 * 1000), // 24 hours
      },
    },
  });

  // if previous request count is greater than or equal to 5, throw error
  if (previousRequestCount >= 5) {
    throw new ApiError({
      message: "Too many attempts. Please try again later",
      errors: [
        {
          otp: "Too many attempts. Please try again later",
        },
      ],
      status: 429,
    });
  }

  // get latest email verification record
  const emailVerification = await EmailVerification.findOne({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });

  // check if the latest email verification is less than 1 minute old
  if (
    emailVerification &&
    emailVerification.createdAt > new Date(now - 60 * 1000) // 1 minute
  ) {
    throw new ApiError({
      message: "Please wait for 1 minute before requesting another otp",
      errors: [
        {
          otp: "Please wait for 1 minute before requesting another otp",
        },
      ],

      status: 429,
    });
  }

  //generate otp
  const otp = generateOTP(6);

  //hash otp and save it to db
  const hashedOtp = await hashPassword(otp);

  //set all previous otps to expired
  await EmailVerification.update(
    {
      verifiedAt: new Date(),
    },
    {
      where: { userId: user.id, verifiedAt: null },
    }
  );

  //save otp to db
  await EmailVerification.create({
    userId: user.id,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), //expires in 5 minutes
  });

  // update user
  await User.update(
    {
      isEmailVerified: false,
      isEnabled: false,
    },
    {
      where: { id: user.id },
    }
  );

  //send email verification
  try {
    const emailContent = getOtpTemplate({
      greetings: `Dear ${user.userProfile.fullName.split(" ")[0]},`,
      title:
        "Please use the One Time Password (OTP) provided below to verify your email address:",
      otp: otp,
      description:
        "Note: The above OTP will expire in next five minutes. Once expired, you have to regenerate another otp.",
    });

    await sendEmail({
      fromAddress: process.env.EMAIL_FROM_ADDRESS,
      fromName: process.env.EMAIL_FROM_NAME,
      to: email,
      subject: "Email verification - Chhimekee",
      html: emailContent,
    });
  } catch (error) {
    logger.error(error);
  }

  //send response
  return new ApiResponse({
    status: 200,
    message: "Email verification sent successfully",
  }).send(res);
});

/**
 * @desc    Logout user
 * @route   POST prefix/auth/logout
 * @access  Private
 * @param   {Object} req - request object
 * @param   {Object} res - response object
 * @returns {Object} - return response object
 * @example /auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  const token = getCookieToken(req) || getAuthToken(req);

  if (!token) {
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }

  //verify token
  try {
    const decodedToken = verifyToken({
      token: token,
      ignoreExpiration: true,
    });

    //get refresh token from db
    const refreshToken = await RefreshToken.findOne({
      where: {
        id: decodedToken.rfId,
        userId: decodedToken.id,
      },
    });

    if (!refreshToken) {
      throw new ApiError({
        message: "Unauthorized",
        status: 401,
      });
    }

    // verify refresh token
    verifyToken({
      token: refreshToken.token,
    });

    //delete refresh token hard from db
    await RefreshToken.destroy({
      where: {
        id: refreshToken.id,
      },
      force: true,
    });

    //delete token from cookie
    res.clearCookie("accessToken");

    //delete fcm token if exists
    const { fcmToken, deviceId, deviceType } = req.body;

    if (fcmToken && deviceId && deviceType) {
      await FcmToken.destroy({
        where: {
          userId: decodedToken.id,
          token: fcmToken,
          deviceId: deviceId,
          deviceType: deviceType,
        },
        force: true,
      });
    }

    return new ApiResponse({
      status: 200,
      message: "Logged out successfully",
    }).send(res);
  } catch (error) {
    logger.error(error);
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }
});

/**
 * @desc    Logout user from all devices
 * @route   POST prefix/auth/logout-all
 * @access  Private
 * @param   {Object} req - request object
 * @param   {Object} res - response object
 * @returns {Object} - return response object
 * @example /auth/logoutAll
 */
export const logoutAll = asyncHandler(async (req, res) => {
  const token = getCookieToken(req) || getAuthToken(req);

  if (!token) {
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }

  //verify token
  try {
    const decodedToken = verifyToken({
      token: token,
      ignoreExpiration: true,
    });

    //get refresh token from db
    const refreshToken = await RefreshToken.findOne({
      where: {
        id: decodedToken.rfId,
        userId: decodedToken.id,
      },
    });

    if (!refreshToken) {
      throw new ApiError({
        message: "Unauthorized",
        status: 401,
      });
    }

    // verify refresh token
    verifyToken({
      token: refreshToken.token,
    });

    //delete refresh token from db
    await RefreshToken.destroy({
      where: {
        userId: decodedToken.id,
      },
      force: true,
    });

    //delete token from cookie
    res.clearCookie("accessToken");

    //delete fcm token of user
    await FcmToken.destroy({
      where: {
        userId: decodedToken.id,
      },
      force: true,
    });

    return new ApiResponse({
      status: 200,
      message: "Logged out successfully",
    }).send(res);
  } catch (error) {
    logger.error(error);
    throw new ApiError({
      message: "Unauthorized",
      status: 401,
    });
  }
});
