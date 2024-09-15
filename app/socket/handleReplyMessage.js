import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const {
  Conversation,
  ConversationParticipant,
  BlockedUser,
  Message,
  MessageMedia,
  Op,
} = db;

import ConversationType from "../enums/conversationType.js";
import { handleSocketError } from "../utils/helper.js";

/**
 * @function handleReplyMessage
 * @description Handles reply message event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleReplyMessage = (socket, io) => {
  socket.on(SocketEvent.REPLY_MESSAGE, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleReplyMessage;
