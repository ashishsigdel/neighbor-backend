import DeviceType from "../enums/deviceType.js";

/**
 * @typedef {object} FCMToken
 * @property {number} id - FCMToken id
 * @property {string} token - FCMToken token
 * @property {number} userId - FCMToken userId
 * @property {string} deviceId - FCMToken deviceId
 * @property {string} deviceType - FCMToken deviceType
 * @property {date} createdAt - FCMToken creation date
 * @property {date} updatedAt - FCMToken update date
 */

/**
 * @description FCMToken model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} FCMToken model
 * @exports FCMToken
 */

const FcmToken = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "FcmToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deviceId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      deviceType: {
        type: DataTypes.ENUM(Object.values(DeviceType)),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

export default FcmToken;
