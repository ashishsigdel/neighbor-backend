import ReactionType from "../enums/reactionType.js";

/**
 * @typedef CommentReaction
 * @property {number} id - CommentReaction id
 * @property {string} title - CommentReaction title
 * @property {number} userId - CommentReaction userId
 * @property {number} postId - CommentReaction postId
 * @property {date} createdAt - CommentReaction creation date
 * @property {date} updatedAt - CommentReaction update date
 */

/**
 * @description CommentReaction model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} CommentReaction model
 * @exports CommentReaction
 */
const CommentReaction = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "CommentReaction",
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
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the comment where the reaction was made",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

export default CommentReaction;
