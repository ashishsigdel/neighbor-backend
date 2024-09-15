import ReactionType from "../enums/reactionType.js";

/**
 * @typedef MomentCommentReaction
 * @property {number} id - CommentReaction id
 * @property {string} title - CommentReaction title
 * @property {number} userId - CommentReaction userId
 * @property {number} momentId - CommentReaction momentId
 * @property {date} createdAt - CommentReaction creation date
 * @property {date} updatedAt - CommentReaction update date
 */

/**
 * @description MomentCommentReaction model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} MomentCommentReaction model
 * @exports MomentCommentReaction
 */
const MomentCommentReaction = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "MomentCommentReaction",
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

export default MomentCommentReaction;
