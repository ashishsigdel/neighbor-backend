/**
 * @typedef {Object} ConversationParticipantEvent
 * @description Conversation participant event enum
 * @readonly
 * @property {string} ADDED - participant added to conversation
 * @property {string} REMOVED - participant removed from conversation
 * ...
 * @example
 * import ConversationParticipantEvent from "./app/enums/conversationParticipantEvent.js";
 * ConversationParticipantEvent.ADDED // for participant added to conversation
 * ConversationParticipantEvent.REMOVED // for participant removed from conversation
 * ...
 * @module conversationParticipantEvent
 * @exports ConversationParticipantEvent
 */

const ConversationParticipantEvent = {
  ADDED: "added",
  REMOVED: "removed",
  LEFT: "left",
  GROUP_CREATED: "group_created",
};

export default ConversationParticipantEvent;
