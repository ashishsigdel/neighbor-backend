import db from "../models/index.js";

import { getMimeType, removeLocalFileFromPath } from "../utils/helper.js";
import { createFileStream } from "../services/fileStorageService.js";
import { uploadFile, deleteFile, copyObject } from "../services/s3Service.js";
import { v4 as uuidv4 } from "uuid";

const { Media } = db;

export const createMedia = async ({ directory, file, user, mediaType }) => {
  const fileKey = file.filename;
  const fileStream = createFileStream(file.path);

  const fileUpload = await uploadFile({
    fileBuffer: fileStream,
    fileName: fileKey,
    directory: directory,
    modifyKey: false,
  });

  //delete local file
  removeLocalFileFromPath(file.path);

  //upload new profile picture in media table
  const fileMedia = await Media.create({
    userId: user.id,
    mediaType: mediaType,
    fileName: (fileUpload.Key || fileUpload.key).split("/").pop(),
    path: directory,
    mimeType: getMimeType(file.filename),
    size: file.size,
  });

  return fileMedia;
};

export const deleteMedia = async (media) => {
  //delete media from s3
  await deleteFile({
    file: media.fileName,
    directory: media.path,
  });

  //delete media from media table
  await media.destroy({
    force: true,
  });
};

export const deleteMediaById = async (mediaId) => {
  const media = await Media.findByPk(mediaId);

  if (!media) {
    return;
  }

  await deleteMedia(media);
};

/**
 * @param {Object} currentMedia
 * @returns {Promise}
 * @description Copies the current media to a new file name
 */
export const updateMediaWithCopy = async ({ currentMedia }) => {
  const newFileName = `${uuidv4()}.${currentMedia.fileName.split(".").pop()}`;

  await copyObject({
    directory: currentMedia.path,
    oldKey: currentMedia.fileName,
    newKey: newFileName,
  });

  //update current media with new media details
  currentMedia.fileName = newFileName;
  await currentMedia.save();
};
