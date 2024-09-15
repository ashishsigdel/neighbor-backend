import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const {
  Message,
  MessageReaction,
} = db;

import ReactionType from "../enums/reactionType.js";

import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handleReactMessage
 * @description Handles react message event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleReactMessage = (socket, io) => {
  socket.on(SocketEvent.REACT_MESSAGE, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());

      // payload can have conversationId, messageId, reactionType
      const { conversationId, messageId, reactionType } = payload;

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

      if (!reactionType) {
        throw new ApiError({
          status: 400,
          message: "Reaction type is required",
        });
      }

      // validate reaction type
      if (!Object.values(ReactionType).includes(reactionType)) {
        throw new ApiError({
          status: 400,
          message: "Invalid reaction type",
        });
      }

      // check if conversation exists
      const conversation = await handleIfConversationExists(
        socket,
        conversationId
      );

      //validate messageId
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

      // check if already reacted
      const messageReaction = await MessageReaction.findOne({
        where: {
          messageId: messageId,
          userId: socket.user.id,
        },
      });

      // if already reacted, update reaction type
      if (messageReaction) {
        messageReaction.type = reactionType;
        await messageReaction.save();

        // emit message reaction to room
        io.to(conversation.conversationId).emit(SocketEvent.REACT_MESSAGE, {
          conversationId: conversation.conversationId,
          messageId: messageId,
          reactionType: reactionType,
          user: {
            id: socket.user.id,
            username: socket.user.username,
            fullName: socket.user.userProfile.fullName,
            profilePicture: socket.user.userProfile.profilePicture || null,
            isOnline: true,
            lastOnlineAt: socket.user.lastOnlineAt,
          },
        });

        return;
      }

      // if not reacted, create new reaction
      await MessageReaction.create({
        type: reactionType,
        userId: socket.user.id,
        messageId: messageId,
      });

      // emit message reaction to room
      return io
        .to(conversation.conversationId)
        .emit(SocketEvent.REACT_MESSAGE, {
          conversationId: conversation.conversationId,
          messageId: messageId,
          reactionType: reactionType,
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

export default handleReactMessage;
