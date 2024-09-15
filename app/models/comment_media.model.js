/**
 * @typedef {object} CommentMedia
 * @property {number} id - CommentMedia id
 * @property {number} commentId - Comment id
 * @property {number} mediaId - Media id
 * @property {date} createdAt - CommentMedia creation date
 * @property {date} updatedAt - CommentMedia update date
 * @property {date} deletedAt - CommentMedia deletion date
 */

/**
 * @description CommentMedia model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} CommentMedia model
 * @exports CommentMedia
 */

const CommentMedia = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "CommentMedia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Comment id",
      },
      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Media id",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: "comment_medias",
    }
  );
};

export default CommentMedia;
