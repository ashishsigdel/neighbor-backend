import ReactionType from "../enums/reactionType.js";

/**
 * @typedef MomentReaction
 * @property {number} id - MomentReaction id
 * @property {enum} type - MomentReaction type
 * @property {number} userId - MomentReaction userId
 * @property {number} momentId - MomentReaction momentId
 * @property {date} createdAt - MomentReaction creation date
 * @property {date} updatedAt - MomentReaction update date
 */

/**
 * @description MomentReaction model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} MomentReaction model
 * @exports MomentReaction
 */
const MomentReaction = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "MomentReaction",
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
      momentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the moment where the reaction was made",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

export default MomentReaction;
