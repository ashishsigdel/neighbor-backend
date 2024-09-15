/**
 * @typedef {object} PostMedia
 * @property {number} id - PostMedia id
 * @property {number} postId - Post id
 * @property {number} mediaId - Media id
 * @property {date} createdAt - PostMedia creation date
 * @property {date} updatedAt - PostMedia update date
 * @property {date} deletedAt - PostMedia deletion date
 */

/**
 * @description PostMedia model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} PostMedia model
 * @exports PostMedia
 */

const PostMedia = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "PostMedia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Post id",
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
    }
  );
};

export default PostMedia;
