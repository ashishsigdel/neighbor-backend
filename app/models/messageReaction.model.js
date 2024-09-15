import ReactionType from "../enums/reactionType.js";

/**
 * @typedef MessageReaction
 * @property {number} id - MessageReaction id
 * @property {string} title - MessageReaction title
 * @property {number} userId - MessageReaction userId
 * @property {number} messageId - MessageReaction messageId
 * @property {date} createdAt - MessageReaction creation date
 * @property {date} updatedAt - MessageReaction update date
 */

/**
 * @description MessageReaction model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} MessageReaction model
 * @exports MessageReaction
 * */

const MessageReaction = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "MessageReaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM(Object.values(ReactionType)),
        allowNull: false,
        defaultValue: ReactionType.LOVE,
        comment: "Reaction title",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who reacted",
      },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the message where the reaction was made",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

export default MessageReaction;
