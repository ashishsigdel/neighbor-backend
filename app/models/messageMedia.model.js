/**
 * @typedef {object} MessageMedia
 * @property {number} id - MessageMedia id
 * @property {number} messageId - Message id
 * @property {number} mediaId - Media id
 * @property {date} createdAt - MessageMedia creation date
 * @property {date} updatedAt - MessageMedia update date
 * @property {date} deletedAt - MessageMedia deletion date
 */

/**
 * @description MessageMedia model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} MessageMedia model
 * @exports MessageMedia
 */

const MessageMedia = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "MessageMedia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Message id",
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
      tableName: "message_medias",
    }
  );
};

export default MessageMedia;
