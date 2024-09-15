/**
 * @typedef MomentComment
 * @property {number} id - MomentComment id
 * @property {number} userId - userId (ID of the user who created the comment)
 * @property {number} momentId - momentId (ID of the moment where the comment was made)
 * @property {string} content - content (Comment content)
 * @property {number} parentCommentId - parentCommentId (ID of the parent comment)
 * @property {date} createdAt - MomentComment creation date
 * @property {date} updatedAt - MomentComment update date
 * @property {date} deletedAt - MomentComment deletion date
 */

/**
 * @description MomentComment model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} MomentComment model
 * @exports MomentComment
 */

const MomentComment = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "MomentComment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who created the comment",
      },
      momentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the post where the moment was made",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Comment content",
      },
      parentCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the parent comment",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default MomentComment;
