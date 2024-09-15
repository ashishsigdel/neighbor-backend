import SocketEvent from "../enums/socketEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const {
  Conversation,
  ConversationParticipant,
  Chhimek,
  Op,
  User,
  SocketToken,
  Message,
  Media,
} = db;

import ConversationType from "../enums/conversationType.js";
import { handleSocketError } from "../utils/helper.js";
import ConversationParticipantEvent from "../enums/conversationParticipantEvent.js";
import MessageType from "../enums/messageType.js";

/**
 * @function handleCreateConversation
 * @description Handles create conversation event and emits message to room
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {void}
 */
const handleCreateConversation = (socket, io) => {
  socket.on(SocketEvent.CREATE_CONVERSATION, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());
      // create group conversation
      let { name, participants, mediaId } = payload;

      // validate name if passed
      if (name) {
        name = name.trim();
        if (name.length < 3 || name.length > 30) {
          throw new ApiError({
            status: 400,
            message: "Name must be between 3 and 30 characters",
          });
        }

        const nameRegex = /^[a-zA-Z0-9 ]{3,30}$/;

        if (!nameRegex.test(name)) {
          throw new ApiError({
            status: 400,
            message: "Invalid name",
          });
        }
      }

      let media;

      // validate mediaId if passed
      if (mediaId) {
        media = await Media.findOne({
          where: {
            id: mediaId,
            userId: socket.user.id,
          },
          attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
          through: { attributes: [] },
        });
      }

      if (!participants || participants.length === 0) {
        throw new ApiError({
          status: 400,
          message: "Participants are required",
        });
      }

      // check if participants are unique or not and remove duplicates
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

      //get chhimeks
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

      const usersToAddInGroup = await User.findAll({
        where: {
          id: {
            [Op.notIn]: [
              ...blockedUsers.map((user) => user.blockedUserId),
              ...blockedByUsers.map((user) => user.userId),
            ],

            [Op.in]: [...chhimeksIds, socket.user.id],
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

      if (usersToAddInGroup.length <= 2) {
        throw new ApiError({
          status: 400,
          message: "Minimum 2 users required to create group",
        });
      }

      // create conversation
      const conversation = await Conversation.create({
        name: name,
        type: ConversationType.GROUP,
        createdBy: socket.user.id,
        conversationPictureId: media ? mediaId : null,
      });

      // create conversation participants
      await ConversationParticipant.bulkCreate(
        usersToAddInGroup.map((user) => {
          return {
            conversationId: conversation.id,
            userId: user.id,
            isAdmin: user.id === socket.user.id,
            event:
              user.id === socket.user.id
                ? ConversationParticipantEvent.GROUP_CREATED
                : ConversationParticipantEvent.ADDED,
            eventPerformedBy: socket.user.id,
          };
        })
      );

      await Message.bulkCreate(
        usersToAddInGroup.map((user) => {
          return {
            conversationId: conversation.id,
            senderId: socket.user.id,
            type: MessageType.USER_EVENT,
            affectedUserId: user.id,
            content:
              user.id === socket.user.id
                ? "created group"
                : "added {user} in conversation",
          };
        })
      );

      // get all conversation participants socket tokens
      const socketTokens = await SocketToken.findAll({
        where: {
          userId: {
            [Op.in]: usersToAddInGroup.map((user) => user.id),
          },
        },
        attributes: ["token"],
      });

      //emit event to all conversation participants to join conversation
      socketTokens.forEach((socketToken) => {
        io.to(socketToken.token).emit(SocketEvent.CREATE_CONVERSATION, {
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

export default handleCreateConversation;
