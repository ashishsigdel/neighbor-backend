/**
 * @typedef {object} DeletedConversation
 * @property {number} id - Deleted conversation id
 * @property {number} conversationId - Conversation id
 * @property {number} userId - User id
 * @property {date} createdAt - Deleted conversation creation date
 * @property {date} updatedAt - Deleted conversation update date
 */

/**
 * @description Deleted conversation model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Deleted conversation model
 * @exports DeletedConversation
 */

const DeletedConversation = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "DeletedConversation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Conversation id",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "User id",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

export default DeletedConversation;
