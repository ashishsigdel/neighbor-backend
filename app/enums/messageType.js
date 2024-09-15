/**
 * @description Message type enum
 * @enum {string}
 * @readonly
 * @example
 * import MessageType from "./app/enums/messageType.js";
 * MessageType.REGULAR // for regular messages
 * MessageType.USER_EVENT // for user events
 */
const MessageType = {
  REGULAR: "regular",
  USER_EVENT: "user_event",
};

export default MessageType;
