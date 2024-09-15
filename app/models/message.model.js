import MessageType from "../enums/messageType.js";
/**
 * @typedef {object} Message
 * @property {number} id - Message id
 * @property {number} conversationId - Conversation id
 * @property {number} userId - User id
 * @property {string} content - Message content
 * @property {boolean} isEdited - Is the message edited?
 * @property {date} editedAt - Message edit date
 * @property {number} parentId - Parent message id (if any) for replies
 * @property {date} createdAt - Message creation date
 * @property {date} updatedAt - Message update date
 * @property {date} deletedAt - Message deletion date
 */

/**
 * @description Message model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Message model
 * @exports Message
 */

const Message = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Conversation id",
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "User id of the sender",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Message content",
      },
      type: {
        type: DataTypes.ENUM,
        values: Object.values(MessageType),
        allowNull: false,
        defaultValue: MessageType.REGULAR,
        comment: "Message type",
      },
      // in case of user event, add userId of user who is affected by the event
      affectedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "User id of the user who is affected by the event",
      },

      isEdited: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Is the message edited?",
      },
      editedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Message edit date",
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Parent message id (if any) for replies",
      },
      unsentAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Message unsend date",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default Message;
