import MediaType from "../enums/mediaType.js";
import { generateFileUrl } from "../services/fileStorageService.js";

/**
 * @typedef {Object} MediaType
 * @property {number} id - Media id
 * @property {number} userId - Media userId
 * @property {string} mediaType - Media mediaType
 * @property {string} fileName - Media fileName
 * @property {string} path - Media path
 * @property {string} mimeType - Media mimeType
 * @property {number} size - Media size
 * @property {date} createdAt - Media creation date
 * @property {date} updatedAt - Media update date
 * @property {date} deletedAt - Media deletion date
 */

/**
 * @description Media model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Media model
 * @exports Media
 */

const Media = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Media",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who uploaded the media",
      },

      mediaType: {
        type: DataTypes.ENUM(Object.values(MediaType)),
        allowNull: false,
        comment: "Type of media uploaded",
      },

      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Name of the media file",
      },

      path: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Path of the media file ",
      },

      mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "Mime type of the media file",
      },

      size: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        comment: "Size of the media file in bytes",
      },

      url: {
        type: DataTypes.VIRTUAL,
        get() {
          return generateFileUrl({
            directory: this.path,
            fileName: this.fileName,
          });
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: "medias",
    }
  );
};

export default Media;
