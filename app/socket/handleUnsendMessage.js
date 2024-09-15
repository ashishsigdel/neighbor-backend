import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { Message } = db;

import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handleUnsendMessage
 * @description Handles unsend message event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleUnsendMessage = (socket, io) => {
  socket.on(SocketEvent.UNSEND_MESSAGE, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());

      const { messageId, conversationId } = payload;

      if (!messageId) {
        throw new ApiError({
          status: 400,
          message: "Message id is required",
        });
      }

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

      // check if message exists
      const message = await Message.findOne({
        where: {
          id: messageId,
          conversationId: conversation.id,
          senderId: socket.user.id,
        },
      });

      if (!message) {
        throw new ApiError({
          status: 404,
          message: "Message not found",
        });
      }

      // check if message is already deleted
      if (message.deletedAt) {
        throw new ApiError({
          status: 400,
          message: "Message is already deleted",
        });
      }

      // check if message is already unsent
      if (message.unsentAt) {
        throw new ApiError({
          status: 400,
          message: "Message is already unsent",
        });
      }

      // unsend message
      await message.update({
        unsentAt: Date.now(),
      });

      // emit message to room
      io.to(conversation.conversationId).emit(SocketEvent.UNSEND_MESSAGE, {
        messageId: messageId,
        conversationId: conversationId,
        user: {
          id: socket.user.id,
          username: socket.user.username,
          fullName: socket.user.userProfile.fullName,
          profilePicture: socket.user.userProfile.profilePicture || null,
          isOnline: true,
          lastOnlineAt: socket.user.lastOnlineAt,
        },
      });

      // delete message
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleUnsendMessage;
