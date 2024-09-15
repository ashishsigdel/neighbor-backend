import DeviceType from "../enums/deviceType.js";

/**
 * @typedef LoginHistory
 * @property {number} id - LoginHistory id
 * @property {number} userId - LoginHistory userId
 * @property {string} ipAddress - LoginHistory ipAddress
 * @property {string} userAgent - LoginHistory userAgent
 * @property {string} device - LoginHistory device
 * @property {string} deviceType - LoginHistory deviceType
 * @property {date} createdAt - LoginHistory creation date
 * @property {date} updatedAt - LoginHistory update date
 * @property {date} deletedAt - LoginHistory deletion date
 */

/**
 * @description LoginHistory model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} LoginHistory model
 * @exports LoginHistory
 */

const LoginHistory = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "LoginHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who logged in",
      },
      ipAddress: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "IP address of the user",
      },
      userAgent: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "User agent string from the client",
      },
      device: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "Device information (e.g., model or name)",
      },
      deviceType: {
        type: DataTypes.ENUM(Object.values(DeviceType)),
        allowNull: false,
        comment: "Type of device used for login",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default LoginHistory;
