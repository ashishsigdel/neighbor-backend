import logger from "./logger.js";
import fs from "fs";
import mime from "mime-types";
import MediaType from "../enums/mediaType.js";
import db from "../models/index.js";
const { Hashtag, Mention, User, Op } = db;
import SocketEvent from "../enums/socketEvent.js";
import ApiError from "./apiError.js";

/**
 * @description Generate a random OTP (One Time Password) of given length
 * @param {number} length - Length of OTP to generate
 * @returns {string} - OTP string
 * @example generateOTP(6); // returns a 6 digit OTP
 */
export const generateOTP = (length) => {
  const digits = "0123456789";
  let OTP = "";

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

/**
 *
 * @param {string} localPath
 * @description Removed the local file from the local file system based on the file path
 */
export const removeLocalFileFromPath = (localPath) => {
  fs.unlink(localPath, (err) => {
    if (err) logger.error("Error while removing local files: ", err);
  });
};

/**
 * @description Remove unused multer image files on error
 * @param {object} req - Express request object
 */
export const removeUnusedMulterImageFilesOnError = (req) => {
  try {
    const multerFile = req.file;
    const multerFiles = req.files;

    if (multerFile) {
      // If there is file uploaded and there is validation error
      // We want to remove that file
      removeLocalFileFromPath(multerFile.path);
    }

    if (multerFiles) {
      /** @type {Express.Multer.File[][]}  */
      const filesValueArray = Object.values(multerFiles);
      // If there are multiple files uploaded for more than one fields
      // We want to remove those files as well
      filesValueArray.map((fileFields) => {
        fileFields.map((fileObject) => {
          removeLocalFileFromPath(fileObject.path);
        });
      });
    }
  } catch (error) {
    // fail silently
    logger.error("Error while removing image files: ", error);
  }
};

/**
 * @description Get mime type of a file
 * @param {string} fileName - File name
 * @returns {string} - Mime type of the file
 */
export const getMimeType = (fileName) => {
  return mime.lookup(fileName) || "application/octet-stream";
};

/**
 * @description Extract hashtags from a text
 * @param {string} text - Text to extract hashtags from
 * @returns {string[]} - Array of hashtags
 */
export const extractHashtags = ({ text }) => {
  const hashtags = [];
  const regex = /(?:^|\s)(#)([a-zA-Z\d]+)/gm;
  let match;

  while ((match = regex.exec(text))) {
    const hashtag = {
      hashTag: match[2],
      startIndex: match.index + match[1].length, // Start index of the hashtag text
      endIndex: match.index + match[0].length, // End index of the hashtag text
    };
    hashtags.push(hashtag);
  }

  return hashtags;
};

/**
 * @description Extract mentions from a text
 * @param {string} text - Text to extract mentions from
 * @returns {string[]} - Array of mentions
 */
export const extractMentions = ({ text }) => {
  const mentions = [];
  const regex = /(?:^|\s)(@)([a-zA-Z\d]+)/gm;
  let match;

  while ((match = regex.exec(text))) {
    const mention = {
      mention: match[2],
      startIndex: match.index + match[1].length, // Start index of the mention text
      endIndex: match.index + match[0].length, // End index of the mention text
    };
    mentions.push(mention);
  }

  return mentions;
};

/**
 * @description Get media type from a file name
 * @param {string} fileName - File name
 * @returns {string} - Media type
 */
export const getMediaTypeFromFileName = (fileName) => {
  const mimeType = getMimeType(fileName);
  if (mimeType.startsWith("image")) {
    return MediaType.IMAGE;
  } else if (mimeType.startsWith("video")) {
    return MediaType.VIDEO;
  } else if (mimeType.startsWith("audio")) {
    return MediaType.AUDIO;
  } else if (mimeType.startsWith("application/pdf")) {
    return MediaType.DOCUMENT;
  } else {
    return MediaType.OTHER;
  }
};

/**
 * @description Update hashtags
 * @param {string} params.content - The content string from which hashtags will be extracted.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of hashtag objects from the database.
 */
export const updateHashtags = async ({ content }) => {
  // extract hashtags from post content
  const hashtagsData = extractHashtags({ text: content });

  const hashTags = [];

  // create hashtags
  for (const hashtagData of hashtagsData) {
    const [hashtag] = await Hashtag.findOrCreate({
      where: {
        hashtag: hashtagData.hashTag,
      },
      defaults: {
        hashtag: hashtagData.hashTag,
      },
    });

    hashTags.push(hashtag);
  }

  return hashTags;
};

/**
 * @description Update mentions
 * @param {string} params.content - The content string from which mentions will be extracted.
 * @param {Object} params.req - The request object containing user information.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of mention objects created in the database.
 *
 */

export const updateMentions = async ({ content, req }) => {
  const user = req.user;
  // extract mentions from post content
  let mentionsData = extractMentions({ text: content });

  //validate if all mentioned users exist and if not remove them from the list match current user
  const mentionedUsers = [];

  for (const mentionData of mentionsData) {
    const mentionedUser = await User.findOne({
      where: {
        username: mentionData.mention,
        [Op.not]: {
          id: user.id,
        },
      },
      attributes: ["id"],
    });

    if (mentionedUser) {
      mentionedUsers.push(mentionedUser);
    } else {
      // remove mention from mentionsData
      mentionsData = mentionsData.filter((mention) => mention !== mentionData);
    }
  }

  // bulk create mentions
  if (mentionedUsers.length > 0) {
    return await Mention.bulkCreate(
      mentionedUsers.map((mentionedUser, index) => ({
        mentionedToUser: mentionedUser.id,
        mentionedByUser: user.id,
        startIndex: mentionsData[index].startIndex,
        endIndex: mentionsData[index].endIndex,
      }))
    );
  }

  return [];
};

export const handleSocketError = (socket, error) => {
  let response = {};

  if (!(error instanceof ApiError)) {
    response = {
      status: 500,
      message: "Something went wrong",
      errors: [
        {
          message: error.message,
        },
      ],
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    };
  } else {
    response = {
      status: error.status,
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
      errors: error.errors,
    };
  }

  logger.error(error);

  socket.emit(SocketEvent.CUSTOM_ERROR, response);
};
