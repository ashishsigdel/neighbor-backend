import ApiError from "../utils/apiError.js";
import { getAuthToken, getCookieToken, verifyToken } from "../utils/jwtUtil.js";
import db from "../models/index.js";
import logger from "../utils/logger.js";
import asyncHandler from "../utils/asyncHandler.js";
const { User, Role, RefreshToken } = db;

/**
 * @description Authentication middleware to check if user is logged in or not
 * @module authMiddleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function to pass control to next middleware
 * @example import authMiddleware from "./app/middlewares/auth.middleware.js";
 * router.get("/", authMiddleware, (req, res) => { ... });
 * @returns {void}
 */
/**
 * @description Authentication middleware to check if user is logged in or not
 * @module authMiddleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function to pass control to next middleware
 * @example import authMiddleware from "./app/middlewares/auth.middleware.js";
 * router.get("/", authMiddleware, (req, res) => { ... });
 * @returns {void}
 */
export const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = getCookieToken(req) || getAuthToken(req);

    if (!accessToken) {
      throw new ApiError({
        status: 401,
        message: "Missing token",
        stack: "Access token not found",
      });
    }

    const decodedToken = verifyToken({
      token: accessToken,
    });

    const refreshToken = await RefreshToken.findOne({
      where: {
        id: decodedToken.rfId,
        userId: decodedToken.id,
      },
    });

    if (!refreshToken) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "Refresh token not found",
      });
    }

    // verify refresh token
    verifyToken({
      token: refreshToken.token,
    });

    //check if refresh token is revoked
    if (refreshToken.revoked) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "Refresh token revoked",
      });
    }

    // check if refresh token is expired
    if (refreshToken.expiresAt < Date.now()) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "Refresh token expired",
      });
    }

    // check if user exists
    const user = await User.findOne({
      where: {
        id: decodedToken.id,
      },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["title"],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "User not found with provided token",
      });
    }

    if (!user.isEmailVerified) {
      throw new ApiError({
        status: 403,
        message: "Email not verified",
        errors: [
          {
            isEmailVerified: "Email not verified",
          },
        ],
        stack: "Email not verified",
      });
    }

    if (!user.isEnabled) {
      throw new ApiError({
        status: 403,
        message: "Account is disabled",
        errors: [
          {
            isEnabled: "Account is disabled",
          },
        ],
        stack: "Account is disabled",
      });
    }

    if (user.isAccountLocked) {
      throw new ApiError({
        status: 403,
        message: "Account is locked",
        errors: [
          {
            isAccountLocked: "Account is locked",
          },
        ],
        stack: "Account is locked",
      });
    }

    if (user.isCredentialsExpired) {
      throw new ApiError({
        status: 403,
        message: "Credentials expired",
        errors: [
          {
            isCredentialsExpired: "Credentials expired",
          },
        ],
        stack: "Credentials expired",
      });
    }

    // set user in request object
    req.user = user;
    next();
  } catch (error) {
    logger.error(error);
    throw new ApiError({
      status: 401,
      message: "Invalid token",
      stack: error.stack,
    });
  }
});

/**
 * @description Authorization middleware to check if user is authorized to access a resource
 * @module authMiddleware
 * @param {array} requiredRoles - Roles allowed to access a resource
 * @example import authMiddleware from "./app/middlewares/auth.middleware.js";
 * router.get("/", authMiddleware(["admin", "user"]), (req, res) => { ... });
 * @returns {void}
 */
export const checkUserRoles = (requiredRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const user = req.user;

      // get all user roles
      const userRoles = user.roles.map((role) => role.title);

      // check if user has required role
      if (!userRoles.some((role) => requiredRoles.includes(role))) {
        throw new ApiError({
          status: 403,
          message: "You are not authorized to access this resource",
          errors: [
            {
              roles: "User does not have required role",
            },
          ],
          stack: "User does not have required role",
        });
      }

      next();
    } catch (error) {
      logger.error(error);
      throw new ApiError({
        status: 403,
        message: "You are not authorized to access this resource",
        stack: error.stack,
      });
    }
  });
};
