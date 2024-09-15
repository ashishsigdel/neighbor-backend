/**
 * @typedef {Object} ConversationType
 * @property {string} PRIVATE - private conversation
 * @property {string} GROUP - group conversation
 */

/**
 * @description Conversation type enum
 * @enum {ConversationType}
 * @readonly
 * @example
 * import ConversationType from "./app/enums/conversationType.js";
 * ConversationType.PRIVATE // for private conversation
 * ConversationType.GROUP // for group conversation
 * @module conversationType
 * @exports ConversationType
 */
const ConversationType = {
  PRIVATE: "private",
  GROUP: "group",
};

export default ConversationType;
