/**
 * @description Socket events
 * @enum {string}
 * @readonly
 * @example
 * import SocketEvent from "./app/enums/socketEvent.js";
 * SocketEvent.CONNECTION // "connection"
 * SocketEvent.DISCONNECT // "disconnect"
 * @module socketEvent
 * @exports SocketEvent
 */
const SocketEvent = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  ERROR: "connect_error",
  CUSTOM_ERROR: "custom_error",
  JOIN_CONVERSATION: "join_conversation",
  MESSAGE: "message",
  MESSAGE_SEEN: "message_seen",
  TYPING: "typing",
  STOPPED_TYPING: "stopped_typing",
  UNSEND_MESSAGE: "unsend_message",
  DELETE_MESSAGE: "delete_message",
  EDIT_MESSAGE: "edit_message",
  USER_ONLINE: "user_online",
  USER_OFFLINE: "user_offline",
  REPLY_MESSAGE: "reply_message",
  REACT_MESSAGE: "react_message",
  REMOVE_MESSAGE_REACTION: "remove_message_reaction",
  PIN_MESSAGE: "pin_message",
  UNPIN_MESSAGE: "unpin_message",

  ADD_CONVERSATION_MEMBER: "add_conversation_member",
  REMOVE_CONVERSATION_MEMBER: "remove_conversation_member",
  LEAVE_CONVERSATION: "leave_conversation",
  UPDATE_CONVERSATION: "update_conversation",
  CREATE_CONVERSATION: "create_conversation",
  UPDATE_CONVERSATION_NAME: "update_conversation_name",
  UPDATE_CONVERSATION_IMAGE: "update_conversation_image",
};

export default SocketEvent;
