import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

import { createMedia, updateMediaWithCopy } from "./media.controller.js";

const {
  Op,
  User,
  Media,
  Post,
  Mention,
  Chhimek,
  Comment,
  CommentReaction,
  sequelize,
  UserProfile,
} = db;

import FileStorageDirectory from "../enums/fileStorageDirectory.js";
import PostPrivacy from "../enums/postPrivacy.js";
import ApiResponse from "../utils/apiResponse.js";
import {
  getMediaTypeFromFileName,
  updateHashtags,
  updateMentions,
} from "../utils/helper.js";

import { getPagination, getPagingData } from "../utils/paginationUtil.js";
import { literal } from "sequelize";

/**
 * @description     Reply to comment
 * @route           POST prefix/comments/:commentId/reply
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /comments/1/reply
 * body:
 *  {
 *    "content": "Hello world"
 *  }
 */
export const replyToComment = asyncHandler(async (req, res) => {
  let { content } = req.body;
  const { commentId } = req.params;
  const user = req.user;
  const mediaFile = req.file;

  // return if both content and mediaFiles are empty
  if (!content && !mediaFile) {
    return new ApiResponse({
      status: 400,
      message: "Content or media is required",
    }).send(res);
  }

  // check if comment exists
  const commentExists = await Comment.findOne({
    where: {
      id: commentId,
    },
  });

  // find post
  const post = await Post.findOne({
    where: {
      id: commentExists.postId,
    },
  });

  //check if comment is of the post
  if (!commentExists || commentExists.postId !== post.id) {
    return new ApiResponse({
      status: 404,
      message: "Comment not found",
    }).send(res);
  }

  // check if post is from chhimek
  if (post.privacy === PostPrivacy.CHHIMEK) {
    // check if user is the receiver of the chhimek
    const chhimek = await Chhimek.findOne({
      where: {
        fromUserId: {
          [Op.or]: [user.id, post.userId],
        },
        toUserId: {
          [Op.or]: [user.id, post.userId],
        },
        status: "accepted",
      },
    });

    if (!chhimek) {
      return new ApiResponse({
        status: 403,
        message: "Unable to reply to comment",
      }).send(res);
    }
  }

  // check if post is private and user is not the owner of the post
  if (
    post.privacy === PostPrivacy.ONLY_ME &&
    post.userId !== user.id &&
    post.originalPostId !== user.id
  ) {
    return new ApiResponse({
      status: 403,
      message: "Unable to reply to comment",
    }).send(res);
  }

  // upload media file
  let media;

  if (mediaFile) {
    media = await createMedia({
      directory: FileStorageDirectory.COMMENT,
      file: mediaFile,
      user: user,
      mediaType: getMediaTypeFromFileName(mediaFile.filename),
    });
  }

  // create comment
  const comment = await post.createComment({
    userId: user.id,
    postId: post.id,
    parentCommentId: commentId,
    content,
  });

  // add media to comment
  if (media) {
    await comment.addMedia([media]);
  }

  // update hashtags and mentions
  const hashtags = await updateHashtags({
    content: content,
  });

  await comment.setHashtags(hashtags);

  const mentions = await updateMentions({
    content: content,
    req: req,
  });

  await comment.setMentions(mentions);

  let response = await Comment.findOne({
    where: { id: comment.id },
    attributes: ["id", "content", "createdAt"],
    include: [
      {
        model: Media,
        as: "medias",
        attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
        through: { attributes: [] },
      },
      {
        model: Mention,
        as: "mentions",
        attributes: ["startIndex", "endIndex"],
        through: { attributes: [] },
        include: [
          {
            model: User,
            as: "mentionedTo",
            attributes: ["id", "username"],
          },
        ],
      },
    ],
  });

  return new ApiResponse({
    status: 201,
    message: "Comment replied successfully",
    data: response,
  }).send(res);
});

/**
 * @description     React to comment
 * @route           POST prefix/comments/:commentId/react
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /comments/1/react
 * body:
 *  {
 *    "reaction": "like"
 *  }
 */
export const reactToComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { reaction } = req.body;

  const user = req.user;

  // check if comment exists
  const commentExists = await Comment.findOne({
    where: {
      id: commentId,
    },
  });

  // find post
  const post = await Post.findOne({
    where: {
      id: commentExists.postId,
    },
  });

  //check if comment is of the post
  if (!commentExists || commentExists.postId !== post.id) {
    return new ApiResponse({
      status: 404,
      message: "Comment not found",
    }).send(res);
  }

  // check if post is from chhimek
  if (post.privacy === PostPrivacy.CHHIMEK) {
    // check if user is the receiver of the chhimek
    const chhimek = await Chhimek.findOne({
      where: {
        fromUserId: {
          [Op.or]: [user.id, post.userId],
        },
        toUserId: {
          [Op.or]: [user.id, post.userId],
        },
        status: "accepted",
      },
    });

    if (!chhimek) {
      return new ApiResponse({
        status: 403,
        message: "Unable to react to comment",
      }).send(res);
    }
  }

  // check if post is private and user is not the owner of the post
  if (
    post.privacy === PostPrivacy.ONLY_ME &&
    post.userId !== user.id &&
    post.originalPostId !== user.id
  ) {
    return new ApiResponse({
      status: 403,
      message: "Unable to react to comment",
    }).send(res);
  }

  // check if user has already reacted to the comment
  const commentReaction = await CommentReaction.findOne({
    where: {
      commentId: commentId,
      userId: user.id,
    },
  });

  //update reaction if user has already reacted to the comment
  if (commentReaction) {
    await commentReaction.update({
      reaction: reaction,
    });

    return new ApiResponse({
      status: 200,
      message: "Comment reaction updated successfully",
    }).send(res);
  }

  // create comment reaction
  await CommentReaction.create({
    userId: user.id,
    commentId: commentId,
    type: reaction,
  });

  return new ApiResponse({
    status: 201,
    message: "Comment reacted successfully",
  }).send(res);
});

/**
 * @description     Remove comment reaction
 * @route           DELETE prefix/comments/:commentId/react
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /comments/1/react
 */
export const removeCommentReaction = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const user = req.user;

  // check if comment reaction exists
  const commentReaction = await CommentReaction.findOne({
    where: {
      commentId: commentId,
      userId: user.id,
    },
  });

  if (!commentReaction) {
    return new ApiResponse({
      status: 404,
      message: "Comment reaction not found",
    }).send(res);
  }

  // delete comment reaction
  await commentReaction.destroy({
    force: true,
  });

  return new ApiResponse({
    status: 200,
    message: "Comment reaction removed successfully",
  }).send(res);
});

/**
 * @description     Delete comments of a post
 * @route           DELETE prefix/comments/:commentId
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /comments/1
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const user = req.user;

  // check if comment exists
  const comment = req.comment;

  // check if user is the owner of the comment
  if (comment.userId !== user.id) {
    return new ApiResponse({
      status: 403,
      message: "Unable to delete comment",
    }).send(res);
  }

  // soft delete comment
  await softDeleteParentAndChildComments(comment);

  return new ApiResponse({
    status: 200,
    message: "Comment deleted successfully",
  }).send(res);
});

/**
 * @description     Soft delete comment and its child comments
 * @param {Object} comment - comment object
 * @returns {Promise<void>}
 */
export const softDeleteParentAndChildComments = async (comment) => {
  await comment.destroy();

  //soft delete all mentions
  const mentions = await comment.getMentions();

  for (const mention of mentions) {
    await mention.destroy();
  }

  // update comment media with new media
  const medias = await comment.getMedias();

  // update all media with new media
  for (let i = 0; i < medias.length; i++) {
    await updateMediaWithCopy({
      currentMedia: medias[i],
    });
  }

  // get child comments
  const childComments = await Comment.findAll({
    where: {
      parentCommentId: comment.id,
    },
  });

  // delete child comments
  for (let i = 0; i < childComments.length; i++) {
    await softDeleteParentAndChildComments(childComments[i]);
  }

  return;
};

/**
 * @description     Update comment
 * @route           PUT prefix/comments/:commentId
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /comments/1
 * body:
 *  {
 *    "content": "Hello world"
 *  }
 */
export const updateComment = asyncHandler(async (req, res) => {
  const comment = req.comment;
  const user = req.user;

  let { content } = req.body;

  const mediaFile = req.file;

  // return if content is empty
  if (!content) {
    return new ApiResponse({
      status: 200,
      message: "Comment updated successfully",
    }).send(res);
  }

  // update comment
  await comment.update({
    content: content ? content : comment.content,
  });

  //remove previous hashtags
  await comment.setHashtags([]);

  // update hashtags
  let hashtags = await updateHashtags({
    content: content,
  });

  await comment.setHashtags(hashtags);

  // get current mentions
  const currentMentions = await comment.getMentions();

  for (const currentMention of currentMentions) {
    await currentMention.destroy({
      force: true,
    });
  }

  // create new mentions
  const mentions = await updateMentions({
    content: content,
    req: req,
  });

  await comment.setMentions(mentions);

  //notify users who are not in currentMentions but in newMentions
  const mentionsToNotify = mentions.filter(
    (newMention) =>
      !currentMentions.find(
        (currentMention) =>
          currentMention.mentionedToUser === newMention.mentionedToUser
      )
  );

  // TODO: need to handle notifications

  return new ApiResponse({
    status: 200,
    message: "Comment updated successfully",
  }).send(res);
});

/**
 * @description     Get comment replies
 * @route           GET prefix/comments/:commentId/replies
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /comments/1/replies
 */
export const getCommentReplies = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const post = req.post;
  const comment = req.comment;
  const user = req.user;

  const { limit, offset } = getPagination({ page, size });

  // get blocked users
  const blockedUsers = await user.getBlockedUsers({
    attributes: ["userId", "blockedUserId"],
  });

  // get users blocked by user
  const blockedByUsers = await user.getBlockedByUsers({
    attributes: ["userId", "blockedUserId"],
  });

  // get hidden posts
  const hiddenPosts = await sequelize.query(
    "select post_id from hidden_posts where user_id=:userId",
    {
      replacements: { userId: user.id },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  const query = {
    where: {
      postId: {
        //exclude hidden posts comments
        [Op.notIn]: hiddenPosts.map((post) => post.post_id),

        // only comments of the post
        [Op.eq]: post.id,
      },

      // only replies of the comment
      parentCommentId: {
        [Op.eq]: comment.id,
      },

      // exclude posts from blocked users and users who blocked the current user
      userId: {
        [Op.notIn]: [
          ...blockedUsers.map((user) => user.blockedUserId),
          ...blockedByUsers.map((user) => user.userId),
        ],
      },
    },

    include: [
      {
        model: User,
        as: "user",
        required: true,
        attributes: ["id", "username"],
        include: [
          //user profile
          {
            model: UserProfile,
            as: "userProfile",
            attributes: ["fullName"],
            include: [
              // profile picture
              {
                model: Media,
                as: "profilePicture",
                attributes: [
                  "path",
                  "fileName",
                  "url",
                  "mediaType",
                  "mimeType",
                ],
              },
            ],
          },
        ],
      },
      {
        model: Media,
        as: "medias",
        attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
        through: { attributes: [] },
      },

      //include mentions
      {
        model: Mention,
        as: "mentions",
        attributes: ["startIndex", "endIndex"],
        through: { attributes: [] },
        include: [
          {
            model: User,
            as: "mentionedTo",
            attributes: ["id", "username"],

            include: [
              //user profile
              {
                model: UserProfile,
                as: "userProfile",
                attributes: ["fullName"],
              },
            ],
          },
        ],
      },
    ],

    attributes: [
      "id",
      "content",
      "createdAt",
      //count reactions
      [
        literal(
          `(SELECT COUNT(*) FROM comment_reactions WHERE comment_reactions.comment_id = comment.id)`
        ),
        "reactionsCount",
      ],

      //get own reaction
      [
        literal(
          `(SELECT type FROM comment_reactions WHERE comment_reactions.comment_id = comment.id AND comment_reactions.user_id = ${user.id})`
        ),
        "ownReaction",
      ],

      //count replies
      [
        literal(
          `(SELECT COUNT(*) FROM comments WHERE comments.parent_comment_id = comment.id)`
        ),
        "repliesCount",
      ],
    ],
  };

  const order = [
    //order by createdAt
    ["createdAt", "DESC"],
  ];

  query.limit = limit;
  query.offset = offset;
  query.order = order;

  const commentReplies = await Comment.findAndCountAll(query);

  let data = getPagingData({ paginatedData: commentReplies, page, limit });

  return new ApiResponse({
    status: 200,
    message: "Comment replies retrieved successfully",
    data: data,
  }).send(res);
});

/**
 * @description     Get comment reactions
 * @route           GET prefix/comments/:commentId/reactions
 * @queryParam      page - page number
 * @queryParam      size - number of items per page
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance with paginated data
 * @example
 * /comments/1/reactions?page=1&size=10
 */
export const getCommentReactions = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const post = req.post;
  const comment = req.comment;
  const user = req.user;

  const { limit, offset } = getPagination({ page, size });

  // get blocked users
  const blockedUsers = await user.getBlockedUsers({
    attributes: ["userId", "blockedUserId"],
  });

  // get users blocked by user
  const blockedByUsers = await user.getBlockedByUsers({
    attributes: ["userId", "blockedUserId"],
  });

  // get hidden posts
  const hiddenPosts = await sequelize.query(
    "select post_id from hidden_posts where user_id=:userId",
    {
      replacements: { userId: user.id },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  const query = {
    where: {
      // only reactions of the comment
      id: {
        [Op.eq]: comment.id,
      },

      // exclude posts from blocked users and users who blocked the current user
      userId: {
        [Op.notIn]: [
          ...blockedUsers.map((user) => user.blockedUserId),
          ...blockedByUsers.map((user) => user.userId),
        ],
      },
    },

    include: [
      {
        model: User,
        as: "user",
        required: true,
        attributes: ["id", "username"],
        include: [
          //user profile
          {
            model: UserProfile,
            as: "userProfile",
            attributes: ["fullName"],
            include: [
              // profile picture
              {
                model: Media,
                as: "profilePicture",
                attributes: [
                  "path",
                  "fileName",
                  "url",
                  "mediaType",
                  "mimeType",
                ],
              },
            ],
          },
        ],
      },

      //include comment
      {
        model: Comment,
        as: "comment",
        required: true,
        attributes: [],
        where: {
          postId: {
            //exclude hidden posts comments
            [Op.notIn]: hiddenPosts.map((post) => post.post_id),
          },
        },
      },
    ],

    attributes: [
      "id",
      "type",
      "createdAt",

      //get own comment reaction
      [
        literal(
          `(SELECT type FROM comment_reactions WHERE comment_reactions.comment_id = ${comment.id} AND comment_reactions.user_id = ${user.id})`
        ),
        "ownReaction",
      ],
    ],
  };

  const order = [
    //order by createdAt
    ["createdAt", "DESC"],
  ];

  query.limit = limit;
  query.offset = offset;
  query.order = order;

  const commentReactions = await CommentReaction.findAndCountAll(query);

  let data = getPagingData({ paginatedData: commentReactions, page, limit });

  return new ApiResponse({
    status: 200,
    message: "Comment reactions retrieved successfully",
    data: data,
  }).send(res);
});
