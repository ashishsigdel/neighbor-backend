import NotificationType from "../enums/notificationType.js";

/**
 * @typedef {Object} Notification
 * @property {number} id - Notification id
 * @property {number} userId - Notification userId
 * @property {number} senderId - Notification senderId
 * @property {string} title - Notification title
 * @property {string} body - Notification body
 * @property {string} data - Notification data
 * @property {string} type - Notification type
 * @property {boolean} isRead - Notification isRead
 * @property {string} deepLink - Notification deepLink
 * @property {date} createdAt - Notification creation date
 * @property {date} updatedAt - Notification update date
 * @property {date} deletedAt - Notification deletion date
 */

/**
 * @description Notification model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Notification model
 * @exports Notification
 */

const Notification = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      senderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      body: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      data: {
        allowNull: true,
        type: DataTypes.JSON,
      },
      type: {
        type: DataTypes.ENUM(Object.values(NotificationType)),
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      deepLink: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default Notification;
