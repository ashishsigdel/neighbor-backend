import ConversationParticipantEvent from "../enums/conversationParticipantEvent.js";
import db from "../models/index.js";

import ApiError from "../utils/apiError.js";
const { Conversation, ConversationParticipant } = db;

/**
 * @function handleIfConversationExists
 * @description Handles if conversation exists
 * @param {object} socket - Socket.io socket instance
 * @param {object} io - Socket.io server instance
 * @returns {object} Conversation
 * @throws Will throw an error if conversation not found
 * @throws Will throw an error if user already left conversation
 * @throws Will throw an error if user already removed from conversation
 * @throws Will throw an error if user is not a member of conversation
 */
const handleIfConversationExists = async (socket, conversationId) => {
  // check if conversation exists
  const conversation = await Conversation.findOne({
    where: {
      conversationId: conversationId,
    },
    include: [
      {
        model: ConversationParticipant,
        as: "conversationParticipants",
        required: true,
        where: {
          userId: socket.user.id,
        },
        attributes: ["event", "isAdmin"],
        order: [["createdAt", "DESC"]],
        limit: 1,
      },
    ],
  });

  if (!conversation) {
    throw new ApiError({
      status: 404,
      message: "Conversation not found",
    });
  }

  if (
    conversation.conversationParticipants[0].event ===
      ConversationParticipantEvent.LEFT ||
    conversation.conversationParticipants[0].event ===
      ConversationParticipantEvent.REMOVED
  ) {
    throw new ApiError({
      status: 400,
      message: "You already left this conversation",
    });
  }

  return conversation;
};

export default handleIfConversationExists;
