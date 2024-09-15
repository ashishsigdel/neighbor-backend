/**
 * @typedef {object} DeletedMessage
 * @property {number} id - DeletedMessage id
 * @property {number} messageId - Message id
 * @property {number} userId - User id of the user who deleted the message
 * @property {date} createdAt - DeletedMessage creation date
 * @property {date} updatedAt - DeletedMessage update date
 * @property {date} deletedAt - DeletedMessage deletion date
 */

/**
 * @description DeletedMessage model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} DeletedMessage model
 * @exports DeletedMessage
 */

const DeletedMessage = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "DeletedMessage",
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
        comment: "User id of the user who deleted the message",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default DeletedMessage;
