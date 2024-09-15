import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

import { createMedia, updateMediaWithCopy } from "./media.controller.js";

const {
  Op,
  User,
  UserProfile,
  Media,
  Location,
  Post,
  Mention,
  Chhimek,
  PostReaction,
  Comment,
  sequelize,
  PostReport,
} = db;

import ApiResponse from "../utils/apiResponse.js";
import FileStorageDirectory from "../enums/fileStorageDirectory.js";
import { getMediaTypeFromFileName } from "../utils/helper.js";

import { getPagination, getPagingData } from "../utils/paginationUtil.js";
import { literal } from "sequelize";

/**
 * @description     Create Message Media
 * @route           POST /api/v1/message-media
 * @access          Private
 * @param           {object} req - request object
 * @param           {object} res - response object
 * @returns         {object} response
 * @example         /api/v1/message-media
 */
export const createMessageMedia = asyncHandler(async (req, res) => {
  const user = req.user;
  const mediaFiles = req.files;

  if (!mediaFiles) {
    throw new ApiError({
      message: "Media is required",
      status: 400,
    });
  }

  // media length
  if (mediaFiles.length === 0) {
    throw new ApiError({
      message: "Media is required",
      status: 400,
    });
  }

  // upload media
  const medias = [];

  for (const file of mediaFiles) {
    const media = await createMedia({
      directory: FileStorageDirectory.MESSAGE,
      file: file,
      user: user,
      mediaType: getMediaTypeFromFileName(file.filename),
    });

    medias.push(media);
  }

  // return response
  res.status(201).json({
    success: true,
    message: "Message media uploaded successfully",
    data: medias.map((media) => {
      return {
        id: media.id,
      };
    }),
  });
});
