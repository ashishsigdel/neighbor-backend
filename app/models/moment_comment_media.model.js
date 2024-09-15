/**
 * @typedef {object} MomentCommentMedia
 * @property {number} id - MomentCommentMedia id
 * @property {number} momentCommentId - MomentComment id
 * @property {number} mediaId - Media id
 * @property {date} createdAt - MomentCommentMedia creation date
 * @property {date} updatedAt - MomentCommentMedia update date
 * @property {date} deletedAt - MomentCommentMedia deletion date
 */

/**
 * @description MomentCommentMedia model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} MomentCommentMedia model
 * @exports MomentCommentMedia
 */

const MomentCommentMedia = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "MomentCommentMedia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      momentCommentMediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Moment Comment id",
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
      tableName: "moment_comment_medias",
    }
  );
};

export default MomentCommentMedia;
