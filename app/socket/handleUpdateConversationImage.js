import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { Conversation, Media, Message } = db;

import ConversationType from "../enums/conversationType.js";
import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";
import MessageType from "../enums/messageType.js";

/**
 * @function handleUpdateConversationImage
 * @description Handles update conversation image event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleUpdateConversationImage = (socket, io) => {
  socket.on(SocketEvent.UPDATE_CONVERSATION_IMAGE, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());

      const { conversationId, mediaId } = payload;

      if (!conversationId) {
        throw new ApiError({
          status: 400,
          message: "Conversation id is required",
        });
      }

      if (!mediaId) {
        throw new ApiError({
          status: 400,
          message: "Image is required",
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

      //validate media
      const media = await Media.findOne({
        where: {
          id: mediaId,
          userId: socket.user.id,
        },
        attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
        through: { attributes: [] },
      });

      // check if media exists
      if (!media) {
        throw new ApiError({
          status: 404,
          message: "Image not found",
        });
      }

      // update conversation name
      await Conversation.update(
        {
          conversationPictureId: mediaId,
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
        content: "updated conversation image",
      });

      // emit message to room
      return io
        .to(conversation.conversationId)
        .emit(SocketEvent.UPDATE_CONVERSATION_IMAGE, {
          conversationId: conversation.conversationId,
          conversationPicture: media,
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

export default handleUpdateConversationImage;
