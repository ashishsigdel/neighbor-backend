import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { Message, PinnedMessage } = db;

import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handlePinMessage
 * @description Handles pin message event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */

const handlePinMessage = (socket, io) => {
  socket.on(SocketEvent.PIN_MESSAGE, async (payload) => {
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
        },
      });

      if (!message) {
        throw new ApiError({
          status: 404,
          message: "Message not found",
        });
      }

      // check if message is already pinned
      const pinnedMessage = await PinnedMessage.findOne({
        where: {
          messageId: message.id,
        },
      });

      if (pinnedMessage) {
        await pinnedMessage.destroy({
          force: true,
        });

        // emit message to room
        return io
          .to(conversation.conversationId)
          .emit(SocketEvent.UNPIN_MESSAGE, {
            messageId: message.id,
            conversationId: conversation.conversationId,
            user: {
              id: socket.user.id,
              username: socket.user.username,
              fullName: socket.user.userProfile.fullName,
              profilePicture: socket.user.userProfile.profilePicture || null,
              isOnline: true,
              lastOnlineAt: socket.user.lastOnlineAt,
            },
          });
      } else {
        // create pinned message
        await PinnedMessage.create({
          messageId: message.id,
          userId: socket.user.id,
        });
      }

      // emit message to room
      io.to(conversation.conversationId).emit(SocketEvent.PIN_MESSAGE, {
        messageId: message.id,
        conversationId: conversation.conversationId,
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

export default handlePinMessage;
