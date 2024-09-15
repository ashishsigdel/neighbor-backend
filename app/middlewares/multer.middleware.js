import multer from "multer";
import { multerDiskStorage } from "../services/fileStorageService.js";
import ApiError from "../utils/apiError.js";
import { getMimeType } from "../utils/helper.js";

/**
 * @function uploadImageMiddleware
 * @description Upload image middleware
 * @param {object} options - Options object
 * @param {string} options.directory - Directory name
 * @param {number} options.sizeInMb - File size in MB
 * @param {function} options.fileFilter - File filter function
 * @example
 * import { uploadImageMiddleware } from "./app/middlewares/multer.middleware.js";
 * router.post(
 *  "/",
 * uploadImageMiddleware({
 *  directory: "profilePictures",
 * sizeInMb: 10,
 * }),
 */
export const uploadImageMiddleware = ({ directory, sizeInMb = 10 }) => {
  return multer({
    storage: multerDiskStorage(directory),
    limits: {
      fileSize: sizeInMb * 1024 * 1024, // default 10 MB
    },
    fileFilter: (req, file, cb) => {
      if (getMimeType(file.originalname).startsWith("image")) {
        //accept image files
        cb(null, true);
      } else {
        cb(
          new ApiError({
            status: 400,
            message: "Only image files are allowed",
            errors: [
              {
                file: "Only image files are allowed",
              },
            ],
          })
        );
      }
    },
  });
};

/**
 * @function uploadImageVideoMiddleware
 * @description Upload image and video middleware
 * @param {object} options - Options object
 * @param {string} options.directory - Directory name
 * @param {number} options.sizeInMb - File size in MB
 * @param {function} options.fileFilter - File filter function
 * @example
 * import { uploadImageVideoMiddleware } from "./app/middlewares/multer.middleware.js";
 * router.post(
 * "/",
 * uploadImageVideoMiddleware({
 * directory: "profilePictures",
 * sizeInMb: 50,
 * }),
 */

export const uploadImageVideoMiddleware = ({ directory, sizeInMb = 50 }) => {
  return multer({
    storage: multerDiskStorage(directory),
    limits: {
      fileSize: sizeInMb * 1024 * 1024, // default 50 MB
    },
    fileFilter: (req, file, cb) => {
      if (
        getMimeType(file.originalname).startsWith("image") ||
        getMimeType(file.originalname).startsWith("video")
      ) {
        //accept image files
        cb(null, true);
      } else {
        cb(
          new ApiError({
            status: 400,
            message: "Only image and video files are allowed",
            errors: [
              {
                file: "Only image and video files are allowed",
              },
            ],
          })
        );
      }
    },
  });
};

// uploader for message media can include audio, video, image, documents
export const uploadMessageMediaMiddleware = ({ directory, sizeInMb = 25 }) => {
  return multer({
    storage: multerDiskStorage(directory),
    limits: {
      fileSize: sizeInMb * 1024 * 1024, // default 25 MB
    },
    fileFilter: (req, file, cb) => {
      if (!isMimeTypeAccepted(file.mimetype)) {
        //accept image files
        cb(null, true);
      } else {
        cb(
          new ApiError({
            status: 400,
            message: "This file type is not allowed",
            errors: [
              {
                file: "This file type is not allowed",
              },
            ],
          })
        );
      }
    },
  });
};

const isMimeTypeAccepted = (mimeType) => {
  // check the mime type contains any of the accepted mime types
  for (const acceptedMimeType of acceptedMimeTypesForMessageMedia) {
    if (acceptedMimeType.includes(mimeType)) {
      return true;
    }
  }
};

const acceptedMimeTypesForMessageMedia = [
  "image",
  "video",
  "audio",
  "application/pdf",
  "application/msword",
];
