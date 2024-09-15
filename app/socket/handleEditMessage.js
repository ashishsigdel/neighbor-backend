import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { ConversationParticipant, BlockedUser, Message, DeletedMessage, Op } =
  db;

import ConversationType from "../enums/conversationType.js";
import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handleEditMessage
 * @description Handles edit message event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleEditMessage = (socket, io) => {
  socket.on(SocketEvent.EDIT_MESSAGE, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());

      const { messageId, conversationId, content } = payload;

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

      if (!content) {
        throw new ApiError({
          status: 400,
          message: "Content is required",
        });
      }

      // check if conversation exists
      const conversation = await handleIfConversationExists(
        socket,
        conversationId
      );

      // check if conversation is private
      if (conversation.type === ConversationType.PRIVATE) {
        //get conversation participants
        const conversationParticipant = await ConversationParticipant.findOne({
          where: {
            conversationId: conversation.id,
            userId: {
              [Op.ne]: socket.user.id,
            },
          },
          attributes: ["userId"],
        });

        // check if conversation participant is blocked
        const isBlocked = await BlockedUser.findOne({
          where: {
            // either user is blocked by other user or other user is blocked by user
            [Op.or]: [
              {
                userId: socket.user.id,
                blockedUserId: conversationParticipant.userId,
              },
              {
                userId: conversationParticipant.userId,
                blockedUserId: socket.user.id,
              },
            ],
          },
        });

        if (isBlocked) {
          return socket.emit(
            SocketEvent.CUSTOM_ERROR,
            "You can't edit this message"
          );
        }
      }

      // check if message exists and sender is user
      const message = await Message.findOne({
        where: {
          id: messageId,
          conversationId: conversation.id,
          senderId: socket.user.id,
        },
      });

      // check if message exists
      if (!message) {
        throw new ApiError({
          status: 404,
          message: "Message not found",
        });
      }

      // handle if message is unsent
      if (message.unsentAt) {
        throw new ApiError({
          status: 400,
          message: "Message not found",
        });
      }

      //check if message is deleted
      const deletedMessage = await DeletedMessage.findOne({
        where: {
          messageId: message.id,
          userId: socket.user.id,
        },
      });

      // check if message is already deleted
      if (deletedMessage) {
        throw new ApiError({
          status: 400,
          message: "Message not found",
        });
      }

      // check if message is within 1 minute
      if (message.createdAt < Date.now() - 60 * 1000) {
        // 1 minute
        throw new ApiError({
          status: 400,
          message: "Message can't be edited",
        });
      }

      // check if message is already edited
      if (message.isEdited) {
        throw new ApiError({
          status: 400,
          message: "Message is already edited",
        });
      }

      // update message
      await message.update({
        content: content,
        isEdited: true,
        editedAt: Date.now(),
      });

      // emit message to room
      io.to(conversation.conversationId).emit(SocketEvent.EDIT_MESSAGE, {
        messageId: message.id,
        conversationId: conversation.conversationId,
        content: content,
        isEdited: true,
        editedAt: Date.now(),
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

export default handleEditMessage;
