import PostPrivacy from "../enums/postPrivacy.js";

/**
 * @typedef {Object} Moment
 * @property {number} id - Moment id
 * @property {number} userId - Moment userId
 * @property {string} content - Moment content
 * @property {string} privacy - Moment privacy
 * @property {number} locationId - Moment locationId
 * @property {date} createdAt - Moment creation date
 * @property {date} updatedAt - Moment update date
 * @property {date} deletedAt - Moment deletion date
 */

/**
 * @description Moment model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Moment model
 * @exports Moment
 */

const Moment = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Moment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who created the moment",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Moment content",
      },
      privacy: {
        type: DataTypes.ENUM(Object.values(PostPrivacy)),
        allowNull: false,
        defaultValue: PostPrivacy.PUBLIC,
        comment: "Moment privacy",
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the location",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default Moment;
