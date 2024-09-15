//import all above in module type
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import multer from "multer";
import appRootPath from "app-root-path";
import FileStorageDirectory from "../enums/fileStorageDirectory.js";

/**
 * @description File storage utility functions
 * @module FileStorageUtil
 * @requires uuid
 * @requires path
 * @requires url
 * @requires fs
 * @requires multer
 * @requires constants
 * @exports FileStorageUtil
 * @example import { FileStorageUtil } from "./app/utils/index.js";
 */

// get root directory path
export const rootDir = appRootPath.path;

// get uploads directory path
export const uploadsDir = path.join(
  rootDir,
  FileStorageDirectory.FILE_UPLOAD_PATH
);

/**
 * @function getStaticFilePath
 * @description Get static file path for a file
 * @param {object} req - Express request object
 * @param {string} directory - Directory name
 * @param {string} fileName - File name
 */
export const getStaticFilePath = (req, directory, fileName) => {
  return `${req.protocol}://${req.get("host")}/${
    FileStorageDirectory.FILE_UPLOAD_PATH
  }/${directory}/${fileName}`;
};

/**
 * @function generateFileUrl
 * @description Generate photo url for a file
 * @param {object} req - Express request object
 * @param {string} directory - Directory name
 * @param {string} fileName - File name
 * @example
 * import { FileStorageUtil } from "./app/services/fileStorageService.js";
 * FileStorageUtil.generateFileUrl({ req, directory, fileName });
 * @returns {string} - Photo url
 */
export const generateFileUrl = ({ directory, fileName }) => {
  // return `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/photos/${directory}/${fileName}`;

  const cloudfrountUrl =
    process.env.CLOUDFRONT_CUSTOM_URL || process.env.CLOUDFRONT_URL;

  return `${cloudfrountUrl}/${directory}/${fileName}`;
};

/**
 * @function removeLocalFile
 * @description Remove local file from uploads directory
 * @param {string} directory - Directory name
 * @param {string} fileName - File name
 */
export const removeLocalFile = (directory, fileName) => {
  const filePath = path.join(uploadsDir, directory, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      console.log(err);
    });
  }
};

/**
 * @function multerStorage
 * @description Multer storage
 * @param {string} directory - Directory name to store file
 * @returns {object} - Multer storage object
 */
export const multerDiskStorage = (directory) => {
  return multer.diskStorage({
    destination: async function (req, file, cb) {
      try {
        let fullPath = path.join(uploadsDir, directory);

        if (!fs.existsSync(fullPath)) {
          await fs.promises.mkdir(fullPath, { recursive: true });
        }
        cb(null, fullPath);
      } catch (err) {
        cb(err.message);
      }
    },
    filename: function (req, file, cb) {
      try {
        const fileName = uuidv4();
        cb(null, fileName + path.extname(file.originalname));
      } catch (err) {
        cb(err.message);
      }
    },
  });
};

/**
 * @function multerStorage
 * @description Multer storage
 * @returns {object} - Multer storage object
 */
export const multerMemoryStorage = () => multer.memoryStorage();

/**
 * @function getFileBuffer
 * @description Get file buffer from file
 * @param {string} filePath - File path
 * @returns {Buffer} - File buffer
 */
export const getFileBuffer = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer;
};

/**
 * @function createFileStream
 * @description Create file stream
 * @param {string} filePath - File path
 * @returns {ReadStream} - File stream
 */
export const createFileStream = (filePath) => {
  return fs.createReadStream(filePath);
};
