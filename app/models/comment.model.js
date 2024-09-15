/**
 * @typedef Comment
 * @property {number} id - Comment id
 * @property {number} userId - userId (ID of the user who created the comment)
 * @property {number} postId - postId (ID of the post where the comment was made)
 * @property {string} content - content (Comment content)
 * @property {number} parentCommentId - parentCommentId (ID of the parent comment)
 * @property {date} createdAt - Comment creation date
 * @property {date} updatedAt - Comment update date
 * @property {date} deletedAt - Comment deletion date
 */

/**
 * @description Comment model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Comment model
 * @exports Comment
 */

const Comment = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Comment",
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
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the post where the comment was made",
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

export default Comment;
