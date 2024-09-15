import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { Message, MessageReaction } = db;

import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handleRemoveMessageReaction
 * @description Handles remove message reaction event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleRemoveMessageReaction = (socket, io) => {
  socket.on(SocketEvent.REMOVE_MESSAGE_REACTION, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());

      // payload can have conversationId, messageId
      const { conversationId, messageId } = payload;

      if (!conversationId) {
        throw new ApiError({
          status: 400,
          message: "Conversation id is required",
        });
      }

      if (!messageId) {
        throw new ApiError({
          status: 400,
          message: "Message id is required",
        });
      }

      // check if conversation exists
      const conversation = await handleIfConversationExists(
        socket,
        conversationId
      );

      // check if message exists
      const message = await Message.findOne({
        where: {
          id: messageId,
          conversationId: conversation.id,
        },
      });

      if (!message) {
        throw new ApiError({
          status: 404,
          message: "Message not found",
        });
      }

      // hard delete message reaction
      await MessageReaction.destroy({
        where: {
          messageId: message.id,
          userId: socket.user.id,
        },
      });

      // emit message to room
      return io
        .to(conversation.conversationId)
        .emit(SocketEvent.REMOVE_MESSAGE_REACTION, {
          conversationId: conversation.id,
          messageId: message.id,
          user: {
            id: socket.user.id,
            username: socket.user.username,
            fullName: socket.user.userProfile.fullName,
            profilePicture: socket.user.userProfile.profilePicture || null,
            isOnline: true,
            lastOnlineAt: socket.user.lastOnlineAt,
          },
        });
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleRemoveMessageReaction;
