/**
 * @description FileStorageDirectory
 * @enum {string}
 * @readonly
 * @example
 * import FileStorageDirectory from "./app/enums/fileStorageDirectory.js";
 * FileStorageDirectory.FILE_UPLOAD_PATH // "public"
 * @module fileStorageDirectory
 * @exports FileStorageDirectory
 */

const FileStorageDirectory = {
  FILE_UPLOAD_PATH: "public",
  TEMP: "temp",
  PROFILE_PICTURE: "profilePictures",
  COVER_PICTURE: "coverPictures",
  POST: "posts",
  COMMENT: "comments",
  MESSAGE: "messages",
};

export default FileStorageDirectory;
