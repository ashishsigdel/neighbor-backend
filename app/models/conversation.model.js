import ConversationType from "../enums/conversationType.js";

/**
 * @typedef {object} Conversation
 * @property {number} id - Conversation id
 * @property {number} type - Conversation type
 * @property {string} name - Conversation name
 * @property {date} createdAt - Conversation creation date
 * @property {date} updatedAt - Conversation update date
 * @property {date} deletedAt - Conversation deletion date
 */

/**
 * @description Conversation model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Conversation model
 * @exports Conversation
 */
const Conversation = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Conversation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      conversationId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        comment: "Conversation id",
      },
      type: {
        type: DataTypes.ENUM,
        values: Object.values(ConversationType),
        defaultValue: ConversationType.PRIVATE,
        comment: "Conversation type",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Name of the conversation/group chat",
      },
      conversationPictureId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Conversation picture",
      },
      //null if private conversation
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "User id of the creator",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default Conversation;
