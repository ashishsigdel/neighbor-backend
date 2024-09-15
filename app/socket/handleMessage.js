import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { ConversationParticipant, BlockedUser, Message, MessageMedia, Op } = db;

import ConversationType from "../enums/conversationType.js";
import { handleSocketError } from "../utils/helper.js";

import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handleMessages
 * @description Handles message event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleMessage = (socket, io) => {
  socket.on(SocketEvent.MESSAGE, async (message) => {
    try {
      message = JSON.parse(message.toString());

      // message can have content, medias, conversationId
      const { conversationId, content, medias } = message;

      if (!conversationId) {
        throw new ApiError({
          status: 400,
          message: "Conversation id is required",
        });
      }

      // check either content or medias is present
      if (!content && !medias) {
        throw new ApiError({
          status: 400,
          message: "Content or media is required",
        });
      }

      // check media length if only medias are present
      if (!content && medias && medias.length === 0) {
        throw new ApiError({
          status: 400,
          message: "Media is required",
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
            "You can't send message to this user"
          );
        }
      }

      // create message
      const newMessage = await Message.create({
        conversationId: conversation.id,
        senderId: socket.user.id,
        content: content,
      });

      // create message media -- medias should be uploaded to s3 first and only then message should be sent so that message can have media ids and can prevent socket fro dos attack through media upload
      if (medias && medias.length > 0) {
        const messageMedias = medias.map((media) => {
          return {
            messageId: newMessage.id,
            mediaId: media.id,
          };
        });

        await MessageMedia.bulkCreate(messageMedias);
      }

      const messageMedias = await newMessage.getMedias({
        attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
        through: { attributes: [] },
      });

      message = {
        id: newMessage.id,
        conversationId: conversation.conversationId,
        content,
        medias: messageMedias.map((media) => {
          media.dataValues.MessageMedia = undefined;
          return media;
        }),
        sender: {
          id: socket.user.id,
          username: socket.user.username,
          fullName: socket.user.userProfile.fullName,
          profilePicture: socket.user.userProfile.profilePicture || null,
          isOnline: true,
          lastOnlineAt: socket.user.lastOnlineAt,
        },
        createdAt: newMessage.createdAt,
      };

      // only emit message to room
      // to send except current socket, use socket.to instead of io.to
      io.to(conversation.conversationId).emit(SocketEvent.MESSAGE, message);
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleMessage;
