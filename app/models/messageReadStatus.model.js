/**
 * @typedef {object} MessageReadStatus
 * @property {number} id - MessageReadStatus id
 * @property {number} messageId - Message id
 * @property {number} userId - User id of the user who read the message
 * @property {date} createdAt - MessageReadStatus creation date
 * @property {date} updatedAt - MessageReadStatus update date
 * @property {date} deletedAt - MessageReadStatus deletion date
 */

/**
 * @description MessageReadStatus model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} MessageReadStatus model
 * @exports MessageReadStatus
 */

const MessageReadStatus = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "MessageReadStatus",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Message id",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "User id of the user who read the message",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default MessageReadStatus;
