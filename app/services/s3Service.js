import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import mime from "mime-types";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const s3 = new AWS.S3();

/**
 * @param {String} fileName - File name
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} directory - Directory to store file
 * @param {Boolean} modifyKey - Modify key to be unique
 * @returns {Promise}
 * @description Gets all files from S3
 */
export const uploadFile = async ({
  fileBuffer,
  fileName,
  directory,
  modifyKey = true,
}) => {
  const key = modifyKey
    ? `${directory}/${uuidv4()}` + path.extname(fileName)
    : `${directory}/${fileName}`;
  const mimetype = mime.lookup(fileName) || "application/octet-stream";

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  };

  // Uploading files to the bucket
  return s3.upload(params).promise();
};

/**
 * @param {String} file
 * @param {String} directory
 * @returns {Promise}
 * @description Deletes a file from S3
 */
export const deleteFile = async ({ file, directory }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${directory}/${file}`,
  };

  // Deleting files from the bucket
  return s3.deleteObject(params).promise();
};

/**
 * @param {String} file
 * @param {String} directory
 * @returns {Promise}
 * @description Gets a file from S3
 */
export const getFile = async ({ file, directory }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${directory}/${file}`,
  };

  // Getting files from the bucket
  return s3.getObject(params).promise();
};

export const getSignedUrl = async ({ file, directory }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${directory}/${file}`,
    Expires: 60 * 60 * 24 * 7, // 7 days
  };

  // Getting files from the bucket
  return s3.getSignedUrl("getObject", params);
};

/**
 * @returns {Promise}
 * @description Gets all files from S3
 * @example
 * const files = await getAllFiles();
 * console.log(files);
 */
export const getAllFiles = async () => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  // Getting files from the bucket
  return s3.listObjectsV2(params).promise();
};

/**
 * @function getFileStream
 * @param {string} file - File name
 * @param {string} directory - Directory name
 * @returns {object} - File stream
 */
export const getFileStream = ({ file, directory }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${directory}/${file}`,
  };

  return s3.getObject(params).createReadStream();
};

/**
 * @function copyObject
 * @param {string} oldKey - Old key name
 * @param {string} newKey - New key name
 * @param {string} directory - Directory name
 * @returns {object} - File stream
 */
export const copyObject = async ({ oldKey, newKey, directory }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    CopySource: `${process.env.AWS_BUCKET_NAME}/${directory}/${oldKey}`,
    Key: `${directory}/${newKey}`,
  };

  return s3.copyObject(params).promise();
};
