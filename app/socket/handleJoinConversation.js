import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";

import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handleJoinConversation
 * @description Handles join conversation event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */

const handleJoinConversation = (socket, io) => {
  socket.on(SocketEvent.JOIN_CONVERSATION, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());

      const { conversationId } = payload;

      if (!conversationId) {
        throw new ApiError({
          status: 400,
          message: "Conversation id is required",
        });
      }

      // check if conversation exists
      const conversation = await handleIfConversationExists(
        socket,
        conversationId
      );

      // join room
      socket.join(conversation.conversationId);

      // emit join conversation event
      io.to(conversation.conversationId).emit(
        SocketEvent.JOIN_CONVERSATION,
        JSON.stringify({
          conversationId: conversation.conversationId,
          userId: socket.user.id,
        })
      );
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleJoinConversation;
