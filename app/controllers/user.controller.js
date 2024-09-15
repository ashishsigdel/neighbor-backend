import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { hashPassword } from "../services/passwordService.js";

import { createMedia } from "./media.controller.js";

const { User, Role, UserProfile, Media } = db;

import ApiResponse from "../utils/apiResponse.js";
import FileStorageDirectory from "../enums/fileStorageDirectory.js";
import MediaType from "../enums/mediaType.js";

/**
 * @description     Update profile
 * @route           PUT prefix/users/profile
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /users/profile
 *     body:
 *        {
 *          "firstName": "Kamal",
 *          "lastName": "Adhikari",
 *         "phone": "+9779841234567",
 * ...
 *       }
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, gender, dob, bio, username } = req.body;

  const user = req.user;

  let profilePicture;
  let coverPicture;

  if (req.files.profilePicture) {
    profilePicture = req.files.profilePicture[0];
  }

  if (req.files.coverPicture) {
    coverPicture = req.files.coverPicture[0];
  }

  //return response if none of the fields are provided
  if (
    !fullName &&
    !phone &&
    !gender &&
    !dob &&
    !profilePicture &&
    !coverPicture &&
    !bio
  ) {
    return new ApiResponse({
      status: 200,
      message: "Profile updated successfully",
    }).send(res);
  }

  // if profile picture is provided then upload it to s3
  if (profilePicture) {
    const media = await createMedia({
      directory: FileStorageDirectory.PROFILE_PICTURE,
      file: profilePicture,
      user,
      mediaType: MediaType.IMAGE,
    });

    profilePicture = media.id;
  }

  // if cover picture is provided then upload it to s3
  if (coverPicture) {
    const media = await createMedia({
      directory: FileStorageDirectory.COVER_PICTURE,
      file: coverPicture,
      user,
      mediaType: MediaType.IMAGE,
    });

    coverPicture = media.id;
  }

  //update user data with only provided fields
  const updatedFields = {
    fullName,
    phone,
    gender,
    dob,
    profilePictureId: profilePicture,
    coverPictureId: coverPicture,
    bio,
  };

  if (username) {
    await User.update(
      {
        username,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
  }

  await UserProfile.update(updatedFields, {
    where: {
      userId: user.id,
    },
  });

  let responseData = await User.findOne({
    where: { id: user.id },
    attributes: ["id", "username", "email"],
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

  return new ApiResponse({
    status: 200,
    message: "Profile updated successfully",
    data: responseData,
  }).send(res);
});

/**
 * @description     Change password
 * @route           PUT prefix/users/change-password
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /users/change-password
 *    body:
 *      {
 *          "oldPassword": "123456",
 *          "newPassword": "1234567",
 *          "confirmPassword": "1234567"
 *      }
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  const user = req.user;

  //encrypt password
  const hashedPassword = await hashPassword(newPassword);

  //update password
  await User.update(
    {
      password: hashedPassword,
    },
    {
      where: {
        id: user.id,
      },
    }
  );

  return new ApiResponse({
    status: 200,
    message: "Password changed successfully",
  }).send(res);
});
