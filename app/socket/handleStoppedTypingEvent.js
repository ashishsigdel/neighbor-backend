import SocketEvent from "../enums/socketEvent.js";

import ApiError from "../utils/apiError.js";
import { handleSocketError } from "../utils/helper.js";
import handleIfConversationExists from "./checkIfConversationExists.js";

/**
 * @function handleTypingStopEvent
 * @param {Object} socket - socket.io client object
 * @param {Object} io - socket.io server object
 * @returns {void}
 */
const handleTypingStopEvent = (socket, io) => {
  socket.on(SocketEvent.STOPPED_TYPING, async (payload) => {
    try {
      payload = JSON.parse(payload.toString());
      const { conversationId } = payload;

      if (!conversationId) {
        throw new ApiError({
          status: 400,
          message: "Conversation id is required",
        });
      }

      const conversation = await handleIfConversationExists(
        socket,
        conversationId
      );

      const response = {
        conversationId: conversation.conversationId,
        user: {
          id: socket.user.id,
          username: socket.user.username,
          fullName: socket.user.userProfile.fullName,
          profilePicture: socket.user.userProfile.profilePicture || null,
        },
      };

      socket.to(conversationId).emit(SocketEvent.STOPPED_TYPING, response);
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};

export default handleTypingStopEvent;
