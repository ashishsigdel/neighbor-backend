import ReactionType from "../enums/reactionType.js";

/**
 * @typedef PostReaction
 * @property {number} id - PostReaction id
 * @property {number} userId - PostReaction userId
 * @property {number} postId - PostReaction postId
 * @property {date} createdAt - PostReaction creation date
 * @property {date} updatedAt - PostReaction update date
 */

/**
 * @description PostReaction model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} PostReaction model
 * @exports PostReaction
 */
const PostReaction = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "PostReaction",
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
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the post where the reaction was made",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

export default PostReaction;
