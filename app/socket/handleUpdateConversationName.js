import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { Conversation, Message } = db;

import ConversationType from "../enums/conversationType.js";
import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";
import MessageType from "../enums/messageType.js";

/**
 * @function handleUpdateConversationName
 * @description Handles update conversation name event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleUpdateConversationName = (socket, io) => {
  socket.on(SocketEvent.UPDATE_CONVERSATION_NAME, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());

      const { conversationId, name } = payload;

      if (!conversationId) {
        throw new ApiError({
          status: 400,
          message: "Conversation id is required",
        });
      }

      if (!name) {
        throw new ApiError({
          status: 400,
          message: "Conversation name is required",
        });
      }

      // check if conversation exists
      const conversation = await handleIfConversationExists(
        socket,
        conversationId
      );

      // check if conversation is group
      if (conversation.type !== ConversationType.GROUP) {
        throw new ApiError({
          status: 400,
          message: "Unable to update conversation name",
        });
      }

      //validate name
      if (name.length < 3 || name.length > 20) {
        throw new ApiError({
          status: 400,
          message: "Conversation name must be between 3 to 20 characters",
        });
      }

      // validate name, name must be between 3 to 20 characters
      const nameRegex = /^[a-zA-Z0-9 ]{3,30}$/;

      if (!nameRegex.test(name)) {
        throw new ApiError({
          status: 400,
          message: "Invalid name",
        });
      }

      // update conversation name
      await Conversation.update(
        {
          name: name,
        },
        {
          where: {
            id: conversation.id,
          },
        }
      );

      // create new message
      await Message.create({
        conversationId: conversation.id,
        senderId: socket.user.id,
        type: MessageType.USER_EVENT,
        content: "updated conversation name",
      });

      // emit message to room
      return io
        .to(conversation.conversationId)
        .emit(SocketEvent.UPDATE_CONVERSATION_NAME, {
          conversationId: conversation.conversationId,
          name: name,
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

export default handleUpdateConversationName;
