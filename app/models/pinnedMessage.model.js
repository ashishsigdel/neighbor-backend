/**
 * @typedef {object} PinnedMessage
 * @property {number} id - Pinned message id
 * @property {number} messageId - Message id
 * @property {number} userId - User id of the user who pinned the message
 * @property {date} createdAt - Pinned message creation date
 * @property {date} updatedAt - Pinned message update date
 */

/**
 * @description PinnedMessage model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} PinnedMessage model
 * @exports PinnedMessage
 */

const PinnedMessage = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "PinnedMessage",
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
        comment: "User id of the user who pinned the message",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

export default PinnedMessage;
