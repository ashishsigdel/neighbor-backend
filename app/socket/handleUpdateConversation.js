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
 * @function handleUpdateConversation
 * @description Handles update conversation event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */

const handleUpdateConversation = (socket, io) => {
  socket.on(SocketEvent.UPDATE_CONVERSATION, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleUpdateConversation;
