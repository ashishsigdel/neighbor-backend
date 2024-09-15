import PostPrivacy from "../enums/postPrivacy.js";

/**
 * @typedef {Object} Post
 * @property {number} id - Post id
 * @property {number} userId - Post userId
 * @property {string} content - Post content
 * @property {string} privacy - Post privacy
 * @property {number} originalPostId - Post originalPostId
 * @property {number} locationId - Post locationId
 * @property {date} createdAt - Post creation date
 * @property {date} updatedAt - Post update date
 * @property {date} deletedAt - Post deletion date
 */

/**
 * @description Post model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Post model
 * @exports Post
 */

const Post = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who created the post",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Post content",
      },
      privacy: {
        type: DataTypes.ENUM(Object.values(PostPrivacy)),
        allowNull: false,
        defaultValue: PostPrivacy.PUBLIC,
        comment: "Post privacy",
      },
      // self reference to the original post
      originalPostId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the original post",
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

      //index for full text search
      indexes: [
        {
          type: "FULLTEXT",
          name: "post_content_idx",
          fields: ["content"],
        },
      ],
    }
  );
};

export default Post;
