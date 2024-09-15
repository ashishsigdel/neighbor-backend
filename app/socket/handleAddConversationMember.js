import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { ConversationParticipant, SocketToken, User, Chhimek, Message, Op } = db;

import MessageType from "../enums/messageType.js";
import { handleSocketError } from "../utils/helper.js";
import ConversationParticipantEvent from "../enums/conversationParticipantEvent.js";
import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handleAddConversationMember
 * @description Handles add conversation member event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleAddConversationMember = (socket, io) => {
  socket.on(SocketEvent.ADD_CONVERSATION_MEMBER, async (payload) => {
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
          message: "Only admin can add members in conversation",
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

      // get chhimeks of user
      const chhimeks = await Chhimek.findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                {
                  fromUserId: socket.user.id,
                },
                {
                  toUserId: socket.user.id,
                },
              ],
            },
            {
              [Op.or]: [
                {
                  fromUserId: {
                    [Op.in]: participantsIds,
                  },
                },
                {
                  toUserId: {
                    [Op.in]: participantsIds,
                  },
                },
              ],
            },
          ],
          status: "accepted",
        },
        attributes: ["fromUserId", "toUserId"],
      });

      const chhimeksIds = chhimeks.map((chhimek) => {
        return chhimek.fromUserId === socket.user.id
          ? chhimek.toUserId
          : chhimek.fromUserId;
      });

      // get blocked users
      const blockedUsers = await socket.user.getBlockedUsers({
        attributes: ["userId", "blockedUserId"],
      });

      // get users blocked by user
      const blockedByUsers = await socket.user.getBlockedByUsers({
        attributes: ["userId", "blockedUserId"],
      });

      // get participants that are already in conversation
      const participantsInConversation = await ConversationParticipant.findAll({
        where: {
          conversationId: conversation.id,
          userId: {
            [Op.in]: participantsIds,
          },
        },
        attributes: ["userId"],
      });

      const usersToAddInGroup = await User.findAll({
        where: {
          id: {
            [Op.notIn]: [
              ...blockedUsers.map((user) => user.blockedUserId),
              ...blockedByUsers.map((user) => user.userId),
              ...participantsInConversation.map((user) => user.userId),
            ],

            [Op.in]: [...chhimeksIds],
          },
        },
        attributes: ["id"],
      });

      //check length of users to add in group
      if (usersToAddInGroup.length === 0) {
        throw new ApiError({
          status: 400,
          message: "No users to add in group",
        });
      }

      // find or create conversation participants
      await ConversationParticipant.bulkCreate(
        usersToAddInGroup.map((user) => {
          return {
            conversationId: conversation.id,
            userId: user.id,
            isAdmin: false,
            event: ConversationParticipantEvent.ADDED,
            eventPerformedBy: socket.user.id,
          };
        })
      );

      // create user_event message
      await Message.bulkCreate(
        usersToAddInGroup.map((user) => {
          return {
            conversationId: conversation.id,
            senderId: socket.user.id,
            type: MessageType.USER_EVENT,
            affectedUserId: user.id,
            content: "added {user} in conversation",
          };
        })
      );

      // get all conversation participants socket tokens including previous participants
      const socketTokens = await SocketToken.findAll({
        where: {
          userId: {
            [Op.in]: [
              ...participantsInConversation.map((user) => user.userId),
              ...usersToAddInGroup.map((user) => user.id),
            ],
          },
        },
        attributes: ["token"],
      });

      //emit event to all conversation participants to join conversation
      socketTokens.forEach((socketToken) => {
        io.to(socketToken.token).emit(SocketEvent.JOIN_CONVERSATION, {
          conversationId: conversation.conversationId,
          name: conversation.name,
          type: conversation.type,
        });
      });
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleAddConversationMember;
