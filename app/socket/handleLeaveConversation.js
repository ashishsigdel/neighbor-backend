import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { ConversationParticipant, Op, Message } = db;

import ConversationType from "../enums/conversationType.js";
import { handleSocketError } from "../utils/helper.js";
import ConversationParticipantEvent from "../enums/conversationParticipantEvent.js";
import handleIfConversationExists from "./checkIfConversationExists.js";
import MessageType from "../enums/messageType.js";

/**
 * @function handleLeaveConversation
 * @description Handles leave conversation event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */

const handleLeaveConversation = (socket, io) => {
  socket.on(SocketEvent.LEAVE_CONVERSATION, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());

      const { conversationId } = payload;

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

      // return if conversation is private
      if (conversation.type === ConversationType.PRIVATE) {
        throw new ApiError({
          status: 400,
          message: "You are not allowed to leave this conversation",
        });
      }

      // create new conversation participant record with event left
      await ConversationParticipant.create({
        userId: socket.user.id,
        conversationId: conversation.id,
        event: ConversationParticipantEvent.LEFT,
        isAdmin: conversation.conversationParticipants[0].isAdmin,
        eventPerformedBy: socket.user.id,
      });

      // create new message
      await Message.create({
        conversationId: conversation.id,
        senderId: socket.user.id,
        type: MessageType.USER_EVENT,
        content: "left the conversation",
      });

      if (conversation.conversationParticipants[0].isAdmin) {
        // check if user is the only admin of conversation
        const otherAdmins = await ConversationParticipant.findAll({
          where: {
            conversationId: conversation.id,
            isAdmin: true,
            userId: {
              [Op.ne]: socket.user.id,
            },
          },
        });

        // make oldest participant admin if user is the only admin of conversation
        if (otherAdmins.length === 0) {
          const oldestParticipants = await ConversationParticipant.findAll({
            where: {
              conversationId: conversation.id,
              userId: {
                [Op.ne]: socket.user.id,
              },
            },
            order: [["createdAt", "ASC"]],
            group: ["userId"],
          });

          for (const oldestParticipant of oldestParticipants) {
            // check if oldest participant is still in the conversation, if still exists make it admin and break the loop
            const participant = await ConversationParticipant.findOne({
              where: {
                conversationId: conversation.id,
                userId: oldestParticipant.userId,
              },
              order: [["createdAt", "DESC"]],
            });

            if (
              participant.event !== ConversationParticipantEvent.LEFT ||
              participant.event !== ConversationParticipantEvent.REMOVED
            ) {
              await ConversationParticipant.update(
                {
                  isAdmin: true,
                },
                {
                  where: {
                    userId: participant.userId,
                  },
                }
              );

              break;
            }
          }
        }
      }

      // get sockets of conversation participants
      const sockets = await io.in(conversation.conversationId).fetchSockets();

      // leave room of specific user
      for (const socket of sockets) {
        //leave room of specific user
        const user = socket.user;
        if (user.id === socket.user.id) {
          socket.leave(conversation.conversationId);
        }
      }

      // emit leave conversation event
      io.to(conversation.conversationId).emit(SocketEvent.LEAVE_CONVERSATION, {
        conversationId: conversation.conversationId,
        userId: socket.user.id,
      });
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleLeaveConversation;
