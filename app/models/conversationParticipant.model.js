import ConversationParticipantEvent from "../enums/conversationParticipantEvent.js";

/**
 * @typedef {object} ConversationParticipant
 * @property {number} id - Conversation participant id
 * @property {number} conversationId - Conversation id
 * @property {number} userId - User id
 * @property {boolean} isAdmin - Is the user admin of the conversation?
 * @property {boolean} isMuted - Is the user muted in the conversation?
 * @property {string} event - Conversation participant event
 * @property {number} eventPerformedBy - User id of the participant who performed the event
 * @property {date} createdAt - Conversation participant creation date
 * @property {date} updatedAt - Conversation participant update date
 * @property {date} deletedAt - Conversation participant deletion date
 */

/**
 * @description Conversation participant model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Conversation participant model
 * @exports ConversationParticipant
 */

const ConversationParticipant = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "ConversationParticipant",
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "User id",
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Is the user admin of the conversation?",
      },
      isMuted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Is the user muted in the conversation?",
      },
      event: {
        type: DataTypes.ENUM,
        values: Object.values(ConversationParticipantEvent),
        allowNull: false,
        comment: "Conversation participant event",
      },
      eventPerformedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "User id of the participant who performed the event",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default ConversationParticipant;
