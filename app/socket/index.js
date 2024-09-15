import SocketEvent from "../enums/socketEvent.js";
import { verifyToken } from "../utils/jwtUtil.js";
import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
import logger from "../utils/logger.js";
const {
  User,
  UserProfile,
  Role,
  RefreshToken,
  SocketToken,
  Conversation,
  ConversationParticipant,
  Media,
  Op,
  sequelize,
} = db;

import handleMessage from "./handleMessage.js";
import handleMessageSeen from "./handleMessageSeen.js";
import handleTypingStartEvent from "./handleTypingEvent.js";
import handleTypingStopEvent from "./handleStoppedTypingEvent.js";
import handleUnsendMessage from "./handleUnsendMessage.js";
import handlePinMessage from "./handlePinMessage.js";
import handleDeleteMessage from "./handleDeleteMessage.js";
import handleEditMessage from "./handleEditMessage.js";
import handleUpdateConversationImage from "./handleUpdateConversationImage.js";
import handleUpdateConversationName from "./handleUpdateConversationName.js";
import handleCreateConversation from "./handleCreateConversation.js";
import handleAddConversationMember from "./handleAddConversationMember.js";
import ConversationParticipantEvent from "../enums/conversationParticipantEvent.js";
import handleJoinConversation from "./handleJoinConversation.js";
import handleLeaveConversation from "./handleLeaveConversation.js";
import handleReactMessage from "./handleReactMessage.js";
import handleRemoveMessageReaction from "./handleRemoveMessageReaction.js";
import handleRemoveConversationMember from "./handleRemoveConversationMember.js";

/**
 * @function initializeSocketIO
 * @description Initialize socket.io server
 * @param {object} io - Socket.io server instance
 * @returns {object} - Socket.io server instance
 */
const initializeSocketIO = (io) => {
  // clear all socket tokens from database on server restart
  SocketToken.destroy({
    where: {},
    truncate: true,
  });

  /**
   * @function io.use
   * @description Socket.io middleware to verify token and authenticate user
   * @param {object} socket - Socket.io socket instance
   * @param {function} next - Callback function
   * @returns {function} - Callback function
   */
  io.use(async (socket, next) => {
    authenticateSocket(socket, next);
  });

  /**
   * @function io.on
   * @description Socket.io event listener
   * @param {string} SocketEvent.CONNECTION - Socket.io connection event
   * @param {object} socket - Socket.io socket instance
   * @returns {object} - Socket.io socket instance
   */
  return io.on(SocketEvent.CONNECTION, async (socket) => {
    // store socket id in database find or create
    await saveSocketToken(socket);

    socket.on(SocketEvent.DISCONNECT, () => {
      //remove socket id from database
      removeSocketToken(socket);
    });

    socket.on(SocketEvent.ERROR, (error) => {
      //emit error to client
      socket.emit(SocketEvent.ERROR, error.message);

      //disconnect socket connection
      socket.disconnect();
    });

    // events to handle here

    //handle join room
    handleJoinConversation(socket, io);

    //handle messages
    handleMessage(socket, io);

    //handle message seen
    handleMessageSeen(socket, io);

    //handle typing start
    handleTypingStartEvent(socket, io);

    //handle typing stop
    handleTypingStopEvent(socket, io);

    //handle unsend message
    handleUnsendMessage(socket, io);

    //handle pin message
    handlePinMessage(socket, io);

    //handle delete message
    handleDeleteMessage(socket, io);

    //handle edit message
    handleEditMessage(socket, io);

    //handle create conversation
    handleCreateConversation(socket, io);

    //handle update conversation image
    handleUpdateConversationImage(socket, io);

    //handle update conversation name
    handleUpdateConversationName(socket, io);

    //handle add conversation member
    handleAddConversationMember(socket, io);

    //handle leave conversation
    handleLeaveConversation(socket, io);

    //handle react message
    handleReactMessage(socket, io);

    //handle remove message reaction
    handleRemoveMessageReaction(socket, io);

    //handle remove conversation member
    handleRemoveConversationMember(socket, io);
  });
};

/**
 * @function authenticateSocket
 * @description Authenticate socket
 * @param {object} socket - Socket.io socket instance
 * @param {function} next - Callback function
 * @returns {function} - Callback function
 */
const authenticateSocket = async (socket, next) => {
  try {
    //get auth token from handshake
    const token = socket.handshake.auth.token || socket.handshake.headers.token;

    //check if token is passed
    if (!token) {
      throw new ApiError({
        status: 401,
        message: "Missing token",
        stack: "Access token not found",
      });
    }

    //verify token
    const decodedToken = verifyToken({
      token: token,
      ignoreExpiration: true,
    });

    const refreshToken = await RefreshToken.findOne({
      where: {
        id: decodedToken.rfId,
        userId: decodedToken.id,
      },
    });

    if (!refreshToken) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "Refresh token not found",
      });
    }

    // verify refresh token
    verifyToken({
      token: refreshToken.token,
    });

    //check if refresh token is revoked
    if (refreshToken.revoked) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "Refresh token revoked",
      });
    }

    // check if refresh token is expired
    if (refreshToken.expiresAt < Date.now()) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "Refresh token expired",
      });
    }

    // check if user exists
    const user = await User.findOne({
      where: {
        id: decodedToken.id,
      },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["title"],
          through: {
            attributes: [],
          },
        },
        {
          model: UserProfile,
          as: "userProfile",
          attributes: ["id", "fullName"],
          include: [
            {
              model: Media,
              as: "profilePicture",
              attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
            },
          ],
        },
      ],
      attributes: [
        "id",
        "username",
        "isEmailVerified",
        "isEnabled",
        "isAccountLocked",
        "isCredentialsExpired",
        "isOnline",
        "lastOnlineAt",
      ],
    });

    if (!user) {
      throw new ApiError({
        status: 401,
        message: "Invalid token",
        stack: "User not found with provided token",
      });
    }

    if (!user.isEmailVerified) {
      throw new ApiError({
        status: 401,
        message: "Unauthorized",
        stack: "User email not verified",
      });
    }

    if (!user.isEnabled) {
      throw new ApiError({
        status: 401,
        message: "Unauthorized",
        stack: "User account not enabled",
      });
    }

    if (user.isAccountLocked) {
      throw new ApiError({
        status: 401,
        message: "Unauthorized",
        stack: "User account locked",
      });
    }

    if (user.isCredentialsExpired) {
      throw new ApiError({
        status: 401,
        message: "Unauthorized",
        stack: "User credentials expired",
      });
    }

    socket.user = user;

    next();
  } catch (error) {
    logger.error(error);

    let response = {};

    if (!(error instanceof ApiError)) {
      response = {
        status: 401,
        message: "Unauthorized",
        errors: [
          {
            message: error.message,
          },
        ],
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
      };
    } else {
      response = {
        status: error.status,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
        errors: error.errors,
      };
    }

    socket.disconnect();
    next(new Error(JSON.stringify(response)));
  }
};

/**
 * @function saveSocketToken
 * @description Save socket token in database
 * @param {object} socket - Socket.io socket instance
 * @returns {Promise} - Promise
 */
const saveSocketToken = async (socket) => {
  try {
    //store socket id in database find or create
    // also tracks user online status
    await SocketToken.findOrCreate({
      where: {
        token: socket.id,
        userId: socket.user.id,
      },
      defaults: {
        token: socket.id,
        userId: socket.user.id,
      },
    });

    // update user last online and is online status in database if not already updated
    if (!socket.user.isOnline) {
      await User.update(
        {
          isOnline: true,
          lastOnlineAt: Date.now(),
        },
        {
          where: {
            id: socket.user.id,
          },
        }
      );
    }

    //join user to socket rooms
    //get all conversations of user from database so that user can join all conversations and receive messages and send messages
    const conversationParticipants = await ConversationParticipant.findAll({
      where: {
        userId: socket.user.id,
      },
      include: [
        {
          model: Conversation,
          as: "conversation",
          required: true,
          attributes: ["conversationId"],
        },
      ],

      attributes: ["conversationId", "event"],
      order: [["createdAt", "DESC"]],
    });

    // remove duplicates from conversation participants array with conversationId only store the latest data
    const uniqueConversationParticipants = conversationParticipants.reduce(
      (acc, current) => {
        const x = acc.find(
          (item) => item.conversationId === current.conversationId
        );
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      },
      []
    );

    for (const conversationParticipant of uniqueConversationParticipants) {
      try {
        if (
          conversationParticipant.event === ConversationParticipantEvent.LEFT ||
          conversationParticipant.event === ConversationParticipantEvent.REMOVED
        ) {
          continue;
        }

        socket.join(conversationParticipant.conversation.conversationId);
      } catch (error) {}
    }
  } catch (error) {
    logger.error(error);
  }
};

/**
 * @function removeSocketToken
 * @description Remove socket token from database
 * @param {object} socket - Socket.io socket instance
 * @returns {Promise} - Promise
 */
const removeSocketToken = async (socket, io) => {
  try {
    //remove socket id from database
    await SocketToken.destroy({
      where: {
        token: socket.id,
        userId: socket.user.id,
      },
    });

    // update user last online and is online status in database if not already updated
    // get socket tokens count
    const socketTokensCount = await SocketToken.count({
      where: {
        userId: socket.user.id,
      },
    });

    // only update if socket tokens count is 0 i.e. user is offline and other socket connections are closed as well
    if (socketTokensCount === 0) {
      await User.update(
        {
          isOnline: false,
          lastOnlineAt: Date.now(),
        },
        {
          where: {
            id: socket.user.id,
          },
        }
      );
    }
  } catch (error) {
    logger.error(error);
  }
};

export { initializeSocketIO };
