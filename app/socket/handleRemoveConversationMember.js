import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { ConversationParticipant, Message, Op } = db;

import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";
import ConversationParticipantEvent from "../enums/conversationParticipantEvent.js";
import MessageType from "../enums/messageType.js";

/**
 * @function handleRemoveConversationMember
 * @description Handles remove conversation member event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleRemoveConversationMember = (socket, io) => {
  socket.on(SocketEvent.REMOVE_CONVERSATION_MEMBER, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());

      let { conversationId, participants } = payload;

      if (!conversationId) {
        throw new ApiError({
          status: 400,
          message: "Conversation id is required",
        });
      }

      if (!participants || participants.length === 0) {
        throw new ApiError({
          status: 400,
          message: "Participants are required",
        });
      }

      // check if conversation exists
      const conversation = await handleIfConversationExists(
        socket,
        conversationId
      );

      // check if user is admin of conversation
      const conversationParticipant = await ConversationParticipant.findOne({
        where: {
          conversationId: conversation.id,
          userId: socket.user.id,
        },
        order: [["createdAt", "DESC"]],
        limit: 1,
      });

      if (!conversationParticipant || !conversationParticipant.isAdmin) {
        throw new ApiError({
          status: 403,
          message: "Only admin can remove members in conversation",
        });
      }

      // check if participants are unique and remove duplicates
      const uniqueParticipants = participants.filter(
        (participant, index, self) => {
          return (
            index ===
            self.findIndex((t) => {
              return t.id === participant.id;
            })
          );
        }
      );

      const participantsIds = uniqueParticipants.map((participant) => {
        return parseInt(participant.id);
      });

      // check if all participants are in conversation
      const conversationParticipants = await ConversationParticipant.findAll({
        where: {
          conversationId: conversation.id,
          userId: {
            [Op.in]: participantsIds,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      // remove duplicates, if duplicates found use the first data
      const uniqueConversationParticipants = conversationParticipants.filter(
        (participant, index, self) => {
          return (
            index ===
            self.findIndex((t) => {
              return t.userId === participant.userId;
            })
          );
        }
      );

      // remove participants from conversation, i.e leave conversation
      for (const participant of uniqueConversationParticipants) {
        if (participant.userId === socket.user.id) {
          continue;
        }

        if (
          participant.event === ConversationParticipantEvent.REMOVED ||
          participant.event === ConversationParticipantEvent.LEFT
        ) {
          continue;
        }

        await ConversationParticipant.create({
          conversationId: conversation.id,
          userId: participant.userId,
          isAdmin: participant.isAdmin,
          isMuted: participant.isMuted,
          event: ConversationParticipantEvent.REMOVED,
          eventPerformedBy: socket.user.id,
        });

        // create message
        const message = await Message.create({
          conversationId: conversation.id,
          content: `removed {user} from conversation`,
          senderId: socket.user.id,
          type: MessageType.USER_EVENT,
          affectedUserId: participant.userId,
        });

        // emit message to room
        io.to(conversation.conversationId).emit(
          SocketEvent.REMOVE_CONVERSATION_MEMBER,
          {
            conversationId: conversation.conversationId,
          }
        );
      }
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleRemoveConversationMember;
