import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { Conversation, ConversationParticipant, Message, DeletedMessage } = db;

import { handleSocketError } from "../utils/helper.js";

/**
 * @function handleDeleteMessage
 * @description Handles delete message event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleDeleteMessage = (socket, io) => {
  socket.on(SocketEvent.DELETE_MESSAGE, async (payload) => {
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

      const conversation = await Conversation.findOne({
        where: {
          conversationId: conversationId,
        },
        include: [
          {
            model: ConversationParticipant,
            as: "conversationParticipants",
            required: true,
            where: {
              userId: socket.user.id,
            },
            attributes: [],
          },
        ],
      });

      if (!conversation) {
        throw new ApiError({
          status: 404,
          message: "Conversation not found",
        });
      }

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

      // check if message is already deleted
      const deletedMessage = await DeletedMessage.findOne({
        where: {
          messageId: messageId,
          userId: socket.user.id,
        },
      });

      if (deletedMessage) {
        throw new ApiError({
          status: 400,
          message: "Message already deleted",
        });
      }

      // delete message
      await DeletedMessage.create({
        messageId: messageId,
        userId: socket.user.id,
      });

      return socket.emit(SocketEvent.DELETE_MESSAGE, {
        messageId: messageId,
        conversationId: conversationId,
      });
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleDeleteMessage;
