import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { Conversation, Message, MessageReadStatus } = db;

import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handleMessageSeen
 * @description Handle message seen from client
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleMessageSeen = (socket, io) => {
  socket.on(SocketEvent.MESSAGE_SEEN, async (message) => {
    try {
      message = JSON.parse(message.toString());

      // message have conversationId, messageId
      const { conversationId, messageId } = message;

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
      const messageExists = await Message.findOne({
        where: {
          id: messageId,
        },
        include: [
          {
            model: Conversation,
            as: "conversation",
            required: true,
            where: {
              conversationId: conversationId,
            },
          },
        ],
      });

      if (!messageExists) {
        throw new ApiError({
          status: 404,
          message: "Message not found",
        });
      }

      // update message seen status find or create
      await MessageReadStatus.findOrCreate({
        where: {
          messageId: messageId,
          userId: socket.user.id,
        },
        defaults: {
          messageId: messageId,
          userId: socket.user.id,
        },
      });

      if (message.senderId !== socket.user.id) {
        // emit message seen to all conversation participants
        socket.to(conversation.conversationId).emit(SocketEvent.MESSAGE_SEEN, {
          conversationId: conversationId,
          messageId: messageId,
          seenBy: {
            id: socket.user.id,
            username: socket.user.username,
            fullName: socket.user.userProfile.fullName,
            profilePicture: socket.user.userProfile.profilePicture || null,
            isOnline: true,
            lastOnlineAt: socket.user.lastOnlineAt,
          },
        });
      }
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleMessageSeen;
