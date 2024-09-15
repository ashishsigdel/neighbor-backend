import db from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

import { createMedia, updateMediaWithCopy } from "./media.controller.js";

const {
  Op,
  User,
  UserProfile,
  Media,
  Location,
  Post,
  Mention,
  Chhimek,
  PostReaction,
  Comment,
  sequelize,
  PostReport,
} = db;

import ApiResponse from "../utils/apiResponse.js";
import FileStorageDirectory from "../enums/fileStorageDirectory.js";
import {
  getMediaTypeFromFileName,
  updateHashtags,
  updateMentions,
} from "../utils/helper.js";
import PostPrivacy from "../enums/postPrivacy.js";
import { softDeleteParentAndChildComments } from "./comment.controller.js";
import { getPagination, getPagingData } from "../utils/paginationUtil.js";
import { literal } from "sequelize";

/**
 * @description     Create post
 * @route           POST prefix/posts
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /posts
 *    body:
 *      {
 *        "content": "Hello world",
 *        "privacy": "public",
 *        "latitude": "27.717245",
 *        "longitude": "85.323959"
 *      }
 *
 */
export const createPost = asyncHandler(async (req, res) => {
  let { content, privacy, latitude, longitude } = req.body;

  const user = req.user;
  const mediaFiles = req.files;

  // return if both content and mediaFiles are empty
  if (!content && mediaFiles.length === 0) {
    return new ApiResponse({
      status: 400,
      message: "Content or media is required",
    }).send(res);
  }

  // upload media files
  const medias = [];

  if (mediaFiles) {
    for (const file of mediaFiles) {
      const media = await createMedia({
        directory: FileStorageDirectory.POST,
        file: file,
        user: user,
        mediaType: getMediaTypeFromFileName(file.filename),
      });

      medias.push(media);
    }
  }

  // find user location matching with latitude and longitude provided, if not create new record
  const [userLocation] = await Location.findOrCreate({
    where: {
      latitude: latitude,
      longitude: longitude,
      userId: user.id,
    },
    defaults: {
      userId: user.id,
      latitude: latitude,
      longitude: longitude,
    },
    order: [["createdAt", "DESC"]],
  });

  //create post
  const post = await Post.create({
    userId: user.id,
    content,
    privacy,
    locationId: userLocation.id,
  });

  //add media to post
  if (medias.length > 0) {
    await post.addMedia(medias);
  }

  // update hashtags and mentions
  const hashtags = await updateHashtags({ content });

  await post.addHashtags(hashtags);

  const postMentions = await updateMentions({ content, req });

  await post.addMentions(postMentions);

  let response = await Post.findOne({
    where: { id: post.id },
    attributes: ["id", "content", "privacy", "createdAt"],
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
    message: "Post created successfully",
    data: response,
  }).send(res);
});

/**
 * @description     Share post
 * @route           POST prefix/posts/:postId/share
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /posts/1/share
 *    body:
 *      {
 *        "content": "Hello world",
 *        "privacy": "public",
 *        "originalPostId": 1,
 *        "latitude": "27.717245",
 *        "longitude": "85.323959"
 *      }
 */
export const sharePost = asyncHandler(async (req, res) => {
  let { content, privacy, latitude, longitude } = req.body;
  const originalPostId = req.params.postId;

  const user = req.user;

  //find original post
  const originalPost = await Post.findOne({
    where: {
      id: originalPostId,
    },
    attributes: ["id", "userId", "privacy"],
  });

  //check if original post exists
  if (!originalPost) {
    return new ApiResponse({
      status: 404,
      message: "Post not found",
    }).send(res);
  }

  // check if original post is from chhimek
  if (originalPost.privacy === PostPrivacy.CHHIMEK) {
    // check if user is chhimek i.e. connected with each other
    const chhimek = await Chhimek.findOne({
      where: {
        fromUserId: {
          [Op.or]: [user.id, originalPost.userId],
        },
        toUserId: {
          [Op.or]: [user.id, originalPost.userId],
        },
        status: "accepted",
      },
    });

    if (!chhimek) {
      return new ApiResponse({
        status: 403,
        message: "Unable to share post",
      }).send(res);
    }
  }

  // check if post is private and user is not the owner of the post
  if (
    originalPost.privacy === PostPrivacy.ONLY_ME &&
    originalPost.userId !== user.id
  ) {
    return new ApiResponse({
      status: 403,
      message: "Unable to share post",
    }).send(res);
  }

  // find user location matching with latitude and longitude provided, if not create new record
  const [userLocation] = await Location.findOrCreate({
    where: {
      latitude: latitude,
      longitude: longitude,
      userId: user.id,
    },
    defaults: {
      userId: user.id,
      latitude: latitude,
      longitude: longitude,
    },
    order: [["createdAt", "DESC"]],
  });

  //create post
  const post = await Post.create({
    userId: user.id,
    content,
    privacy,
    originalPostId,
    locationId: userLocation.id,
  });

  // update hashtags and mentions
  const hashtags = await updateHashtags({ content });

  await post.addHashtags(hashtags);

  const mentions = await updateMentions({ content, req });

  await post.addMentions(mentions);

  let response = await Post.findOne({
    where: { id: post.id },
    attributes: ["id", "content", "privacy", "createdAt"],
    include: [
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

      {
        model: Post,
        as: "originalPost",
        attributes: ["id", "content", "privacy", "createdAt"],
        include: [
          {
            model: User,
            as: "user",
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
                      "fileName",
                      "path",
                      "mediaType",
                      "mimeType",
                      "url",
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
      },
    ],
  });

  return new ApiResponse({
    status: 201,
    message: "Post shared successfully",
    data: response,
  }).send(res);
});

/**
 * @description     React to post
 * @route           POST prefix/posts/:postId/react
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /posts/1/react
 *   body:
 *    {
 *     "reaction": "like"
 *   }
 */
export const reactToPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { reaction } = req.body;

  const user = req.user;

  //check if post is not only me and user is not the owner of the post
  const post = await Post.findOne({
    where: {
      id: postId,
    },
  });

  if (post.privacy === PostPrivacy.ONLY_ME && post.userId !== user.id) {
    return new ApiResponse({
      status: 404,
      message: "Post not found",
    }).send(res);
  }

  // check if post reaction already exists
  const postReaction = await PostReaction.findOne({
    where: {
      userId: user.id,
      postId: postId,
    },
  });

  // if post reaction already exists update it
  if (postReaction) {
    await postReaction.update({
      type: reaction,
    });

    return new ApiResponse({
      status: 200,
      message: "Post reaction updated successfully",
    }).send(res);
  }

  // create post reaction
  await PostReaction.create({
    userId: user.id,
    postId: postId,
    type: reaction,
  });

  return new ApiResponse({
    status: 201,
    message: "Post reacted successfully",
  }).send(res);
});

/**
 * @description     Remove post reaction
 * @route           DELETE prefix/posts/:postId/react
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /posts/1/react
 */
export const removePostReaction = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const user = req.user;

  // check if post reaction exists
  const postReaction = await PostReaction.findOne({
    where: {
      userId: user.id,
      postId: postId,
    },
  });

  if (!postReaction) {
    return new ApiResponse({
      status: 404,
      message: "Post reaction not found",
    }).send(res);
  }

  // remove post reaction
  await postReaction.destroy({
    force: true,
  });

  return new ApiResponse({
    status: 200,
    message: "Post reaction removed successfully",
  }).send(res);
});

/**
 * @description     Comment on post
 * @route           POST prefix/posts/:postId/comment
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /posts/1/comment
 *  body:
 *   {
 *   "content": "Hello world"
 *  }
 */
export const commentOnPost = asyncHandler(async (req, res) => {
  let { content } = req.body;
  const { postId } = req.params;
  const user = req.user;
  const mediaFile = req.file;

  // return if both content and mediaFiles are empty
  if (!content && !mediaFile) {
    return new ApiResponse({
      status: 400,
      message: "Content or media is required",
    }).send(res);
  }

  // find post
  const post = await Post.findOne({
    where: {
      id: postId,
    },
  });

  // check if post exists
  if (!post) {
    return new ApiResponse({
      status: 404,
      message: "Post not found",
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
        message: "Unable to comment on post",
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
      message: "Unable to comment on post",
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
    postId: postId,
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

  await comment.addHashtags(hashtags);

  const mentions = await updateMentions({
    content: content,
    req: req,
  });

  await comment.addMentions(mentions);

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
    message: "Comment created successfully",
    data: response,
  }).send(res);
});

/**
 * @description     Delete post
 * @route           DELETE prefix/posts/:postId
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /posts/1
 */
export const deletePost = asyncHandler(async (req, res) => {
  const post = req.post;

  //soft delete post
  await post.destroy();

  //rename post media files
  const medias = await post.getMedias();

  for (const media of medias) {
    await updateMediaWithCopy({
      media: media,
    });
  }

  // get all parent comments
  const parentComments = await Comment.findAll({
    where: {
      postId: post.id,
      parentCommentId: null,
    },
  });

  // delete parent and child comments
  for (const parentComment of parentComments) {
    await softDeleteParentAndChildComments(parentComment);
  }

  //delete all mentions soft deleted
  await Mention.destroy({
    where: {
      postId: post.id,
    },
  });

  return new ApiResponse({
    status: 200,
    message: "Post deleted successfully",
  }).send(res);
});

/**
 * @description     Update post
 * @route           PUT prefix/posts/:postId
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /posts/1
 * body:
 * {
 *    "content": "Hello world",
 *    "privacy": "public",
 *    "latitude": "27.717245",
 *    "longitude": "85.323959"
 *  }
 */
export const updatePost = asyncHandler(async (req, res) => {
  let { content, privacy, latitude, longitude } = req.body;

  const post = req.post;
  const user = req.user;

  // find user location matching with latitude and longitude provided, if not create new record
  const [userLocation] = await Location.findOrCreate({
    where: {
      latitude: latitude,
      longitude: longitude,
      userId: user.id,
    },
    defaults: {
      userId: user.id,
      latitude: latitude,
      longitude: longitude,
    },
    order: [["createdAt", "DESC"]],
  });

  // update post
  await post.update({
    content: content ? content : post.content,
    privacy: privacy ? privacy : post.privacy,
    locationId: userLocation.id,
  });

  // update hashtags and mentions
  await post.setHashtags([]);

  let hashtags = await updateHashtags({ content });

  await post.addHashtags(hashtags);

  // get current mentions
  const currentMentions = await post.getMentions();

  // delete all mentions hard deleted
  for (const currentMention of currentMentions) {
    await currentMention.destroy({
      force: true,
    });
  }

  //create new mentions
  const mentions = await updateMentions({
    content: content,
    req: req,
  });

  await post.addMentions(mentions);

  // notify mentioned users
  const mentionedToNotify = mentions.filter(
    (mention) =>
      !currentMentions.find(
        (currentMention) =>
          currentMention.mentionedToId === mention.mentionedToId
      )
  );

  // TODO: send notification to mentioned users

  return new ApiResponse({
    status: 200,
    message: "Post updated successfully",
  }).send(res);
});

/**
 * @description     Get posts
 * @route           GET prefix/posts
 * @queryParam      page - page number
 * @queryParam      size - number of items per page
 * @queryParam      search - search query
 * @queryParam      latitude - latitude of user
 * @queryParam      longitude - longitude of user
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance with paginated data
 * @example
 * /posts?page=1&size=10&search=hello&latitude=27.717245&longitude=85.323959
 */

export const getPosts = asyncHandler(async (req, res) => {
  let { latitude, longitude, page, size, search } = req.query;
  const user = req.user;

  if (!search) search = "";

  //remove @ and other special characters from search query that hamper full text search and database
  search = search.replace(/[^a-zA-Z0-9 ]/g, "");

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

  // posts that are already viewed by user
  const viewedPosts = await sequelize.query(
    "select post_id from post_viewers where user_id=:userId",
    {
      replacements: { userId: user.id },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  const viewedPostsIds = viewedPosts.map((post) => post.post_id);

  //get all chhimeks
  const chhimeks = await Chhimek.findAll({
    where: {
      [Op.or]: [
        {
          fromUserId: user.id,
        },
        {
          toUserId: user.id,
        },
      ],
      status: "accepted",
    },
    attributes: ["fromUserId", "toUserId"],
  });

  const chhimeksIds = chhimeks.map((chhimek) => {
    return chhimek.fromUserId === user.id
      ? chhimek.toUserId
      : chhimek.fromUserId;
  });

  const query = {
    where: {
      //search if search query is provided - Full text search
      [Op.and]: [
        search !== ""
          ? literal(`MATCH(post.content) AGAINST('${search}' IN BOOLEAN MODE)`)
          : {},
      ],

      // exclude posts from blocked users and users who blocked the current user
      userId: {
        [Op.notIn]: [
          ...blockedUsers.map((user) => user.blockedUserId),
          ...blockedByUsers.map((user) => user.userId),
          user.id,
        ],
      },

      //exclude hidden posts
      id: {
        [Op.notIn]: hiddenPosts.map((post) => post.post_id),
      },

      // exclude only me posts
      privacy: {
        [Op.ne]: PostPrivacy.ONLY_ME,
      },

      // exclude posts that are chhimek only and user is not chhimek
      // this is either post privacy is not chhimek or user is chhimek with the post owner
      [Op.or]: [
        {
          privacy: {
            [Op.ne]: PostPrivacy.CHHIMEK,
          },
        },
        {
          userId: {
            [Op.in]: chhimeksIds,
          },
        },
      ],
    },

    include: [
      // get user
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "lastLoggedInAt"],
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
                  "fileName",
                  "path",
                  "mediaType",
                  "mimeType",
                  "url",
                ],
              },
            ],
          },
        ],
      },

      // get medias
      {
        model: Media,
        as: "medias",
        attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
        through: { attributes: [] },
      },

      // get mentions
      {
        model: Mention,
        as: "mentions",
        attributes: ["startIndex", "endIndex"],
        include: [
          {
            model: User,
            as: "mentionedTo",
            attributes: ["id", "username"],
          },
        ],

        through: { attributes: [] },
      },

      // get original if post is shared and handle privacy too
      {
        model: Post,
        as: "originalPost",
        required: false,
        attributes: ["id", "content", "privacy", "createdAt"],
        include: [
          {
            model: User,
            as: "user",
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
                      "fileName",
                      "path",
                      "mediaType",
                      "mimeType",
                      "url",
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
        where: {
          // exclude posts from blocked users and users who blocked the current user
          userId: {
            [Op.notIn]: [
              ...blockedUsers.map((user) => user.blockedUserId),
              ...blockedByUsers.map((user) => user.userId),
              user.id,
            ],
          },

          //exclude hidden posts
          id: {
            [Op.notIn]: hiddenPosts.map((post) => post.post_id),
          },

          // exclude only me posts
          privacy: {
            [Op.ne]: PostPrivacy.ONLY_ME,
          },

          // exclude posts that are chhimek only and user is not chhimek
          // this is either post privacy is not chhimek or user is chhimek with the post owner
          [Op.or]: [
            {
              privacy: {
                [Op.ne]: PostPrivacy.CHHIMEK,
              },
            },
            {
              userId: {
                [Op.in]: chhimeksIds,
              },
            },
          ],
        },
      },

      // get location
      {
        model: Location,
        as: "location",
        required: true,
        attributes: [
          "latitude",
          "longitude",
          // [
          // calculate distance between user and post location
          //   literal(
          //     `6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`
          //   ),
          //   "distance",
          // ],
        ],
      },
    ],

    attributes: [
      "id",
      "content",
      "privacy",
      "createdAt",
      "user_id",

      //count viewers
      [
        literal(
          `(SELECT COUNT(*) FROM post_viewers WHERE post_viewers.post_id = post.id)`
        ),
        "viewersCount",
      ],

      //count comments
      [
        literal(
          `(SELECT COUNT(*) FROM comments WHERE comments.post_id = post.id)`
        ),
        "commentsCount",
      ],

      //count reactions
      [
        literal(
          `(SELECT COUNT(*) FROM post_reactions WHERE post_reactions.post_id = post.id)`
        ),
        "reactionsCount",
      ],

      //get own reaction
      [
        literal(
          `(SELECT type FROM post_reactions WHERE post_reactions.post_id = post.id AND post_reactions.user_id = ${user.id})`
        ),
        "ownReaction",
      ],

      // distance between user and post location
      [
        literal(
          `6371 * acos(cos(radians(${latitude})) * cos(radians(location.latitude)) * cos(radians(location.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(location.latitude)))`
        ),
        "distance",
      ],
    ],
  };

  // set limits, offsets and order
  const order = [
    // posts that are not viewed by user
    [
      literal(
        `CASE WHEN ${
          viewedPostsIds.length > 0
            ? `post.id IN (${viewedPostsIds.join(",")})`
            : "FALSE"
        } THEN 1 ELSE 0 END ASC`
      ),

      // literal(
      //   `CASE WHEN post.id IN
      //   (${viewedPostsIds.join(",")})
      //    THEN 1 ELSE 0 END ASC`
      // ),
    ],

    //sort by chhimek
    [
      literal(
        `CASE WHEN ${
          chhimeksIds.length > 0
            ? `post.user_id IN (${chhimeksIds.join(",")})`
            : "FALSE"
        } THEN 1 ELSE 0 END DESC`
      ),

      // literal(
      //   `CASE WHEN post.user_id IN
      //   (${chhimeksIds.join(",")})
      //    THEN 1 ELSE 0 END DESC`
      // ),
    ],

    //order by createdAt
    ["createdAt", "DESC"],

    //order by distance
    [literal(`distance`), "ASC"],
  ];

  query.limit = limit;
  query.offset = offset;
  query.order = order;

  // execute query
  const posts = await Post.findAndCountAll(query);

  let data = getPagingData({ paginatedData: posts, page, limit });

  data.data = data.data.map((post) => {
    post.dataValues.user_id = undefined;
    post.dataValues.location = undefined;
    post.dataValues.distance = undefined;
    return post;
  });

  return new ApiResponse({
    status: 200,
    message: "Posts retrieved successfully",
    data: data,
  }).send(res);
});

/**
 * @description     Get chhimkeks posts
 * @route           GET prefix/posts/chhimeks
 * @queryParam      page - page number
 * @queryParam      size - number of items per page
 * @queryParam      search - search query
 * @queryParam      latitude - latitude of user
 * @queryParam      longitude - longitude of user
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance with paginated data
 * @example
 * /posts/chhimeks?page=1&size=10&search=hello&latitude=27.717245&longitude=85.323959
 */

export const getChhimeksPost = asyncHandler(async (req, res) => {
  let { latitude, longitude, page, size, search, radius } = req.query;
  const user = req.user;

  if (!search) search = "";
  if (!radius) radius = 20; // default radius is 20km

  //remove @ and other special characters from search query that hamper full text search and database
  search = search.replace(/[^a-zA-Z0-9 ]/g, "");

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

  // posts that are already viewed by user
  const viewedPosts = await sequelize.query(
    "select post_id from post_viewers where user_id=:userId",
    {
      replacements: { userId: user.id },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  const viewedPostsIds = viewedPosts.map((post) => post.post_id);

  //get all chhimeks
  const chhimeks = await Chhimek.findAll({
    where: {
      [Op.or]: [
        {
          fromUserId: user.id,
        },
        {
          toUserId: user.id,
        },
      ],
      status: "accepted",
    },
    attributes: ["fromUserId", "toUserId"],
  });

  const chhimeksIds = chhimeks.map((chhimek) => {
    return chhimek.fromUserId === user.id
      ? chhimek.toUserId
      : chhimek.fromUserId;
  });

  const query = {
    where: {
      //search if search query is provided - Full text search
      [Op.and]: [
        search !== ""
          ? literal(`MATCH(post.content) AGAINST('${search}' IN BOOLEAN MODE)`)
          : {},
      ],

      // exclude posts from blocked users and users who blocked the current user
      userId: {
        [Op.notIn]: [
          ...blockedUsers.map((user) => user.blockedUserId),
          ...blockedByUsers.map((user) => user.userId),
          user.id,
        ],
      },

      //exclude hidden posts
      id: {
        [Op.notIn]: hiddenPosts.map((post) => post.post_id),
      },

      // exclude only me posts
      privacy: {
        [Op.ne]: PostPrivacy.ONLY_ME,
      },

      // exclude posts that are chhimek only and user is not chhimek
      // this is either post privacy is not chhimek or user is chhimek with the post owner
      [Op.or]: [
        {
          privacy: {
            [Op.ne]: PostPrivacy.CHHIMEK,
          },
        },
        {
          userId: {
            [Op.in]: chhimeksIds,
          },
        },
      ],

      //get chhimeks posts only
      userId: {
        [Op.in]: chhimeksIds,
      },

      // get posts within radius
      [Op.and]: [
        literal(
          `6371 * acos(cos(radians(${latitude})) * cos(radians(location.latitude)) * cos(radians(location.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(location.latitude))) <= ${radius}`
        ),
      ],
    },

    include: [
      // get user
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "lastLoggedInAt"],
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
                  "fileName",
                  "path",
                  "mediaType",
                  "mimeType",
                  "url",
                ],
              },
            ],
          },
        ],
      },

      // get medias
      {
        model: Media,
        as: "medias",
        attributes: ["fileName", "path", "mediaType", "mimeType", "url"],
        through: { attributes: [] },
      },

      // get mentions
      {
        model: Mention,
        as: "mentions",
        attributes: ["startIndex", "endIndex"],
        include: [
          {
            model: User,
            as: "mentionedTo",
            attributes: ["id", "username"],
          },
        ],

        through: { attributes: [] },
      },

      // get original if post is shared and handle privacy too
      {
        model: Post,
        as: "originalPost",
        required: false,
        attributes: ["id", "content", "privacy", "createdAt"],
        include: [
          {
            model: User,
            as: "user",
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
                      "fileName",
                      "path",
                      "mediaType",
                      "mimeType",
                      "url",
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
        where: {
          // exclude posts from blocked users and users who blocked the current user
          userId: {
            [Op.notIn]: [
              ...blockedUsers.map((user) => user.blockedUserId),
              ...blockedByUsers.map((user) => user.userId),
              user.id,
            ],
          },

          //exclude hidden posts
          id: {
            [Op.notIn]: hiddenPosts.map((post) => post.post_id),
          },

          // exclude only me posts
          privacy: {
            [Op.ne]: PostPrivacy.ONLY_ME,
          },

          // exclude posts that are chhimek only and user is not chhimek
          // this is either post privacy is not chhimek or user is chhimek with the post owner
          [Op.or]: [
            {
              privacy: {
                [Op.ne]: PostPrivacy.CHHIMEK,
              },
            },
            {
              userId: {
                [Op.in]: chhimeksIds,
              },
            },
          ],
        },
      },

      // get location
      {
        model: Location,
        as: "location",
        required: true,
        attributes: [
          "latitude",
          "longitude",
          // [
          // calculate distance between user and post location
          //   literal(
          //     `6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`
          //   ),
          //   "distance",
          // ],
        ],
      },
    ],

    attributes: [
      "id",
      "content",
      "privacy",
      "createdAt",
      "user_id",

      //count viewers
      [
        literal(
          `(SELECT COUNT(*) FROM post_viewers WHERE post_viewers.post_id = post.id)`
        ),
        "viewersCount",
      ],

      //count comments
      [
        literal(
          `(SELECT COUNT(*) FROM comments WHERE comments.post_id = post.id)`
        ),
        "commentsCount",
      ],

      //count reactions
      [
        literal(
          `(SELECT COUNT(*) FROM post_reactions WHERE post_reactions.post_id = post.id)`
        ),
        "reactionsCount",
      ],

      //get own reaction
      [
        literal(
          `(SELECT type FROM post_reactions WHERE post_reactions.post_id = post.id AND post_reactions.user_id = ${user.id})`
        ),
        "ownReaction",
      ],

      // distance between user and post location
      [
        literal(
          `6371 * acos(cos(radians(${latitude})) * cos(radians(location.latitude)) * cos(radians(location.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(location.latitude)))`
        ),
        "distance",
      ],
    ],
  };

  // set limits, offsets and order
  const order = [
    // posts that are not viewed by user
    [
      literal(
        `CASE WHEN ${
          viewedPostsIds.length > 0
            ? `post.id IN (${viewedPostsIds.join(",")})`
            : "FALSE"
        } THEN 1 ELSE 0 END ASC`
      ),

      // literal(
      //   `CASE WHEN post.id IN
      //   (${viewedPostsIds.join(",")})
      //    THEN 1 ELSE 0 END ASC`
      // ),
    ],

    //sort by chhimek
    [
      literal(
        `CASE WHEN ${
          chhimeksIds.length > 0
            ? `post.user_id IN (${chhimeksIds.join(",")})`
            : "FALSE"
        } THEN 1 ELSE 0 END DESC`
      ),

      // literal(
      //   `CASE WHEN post.user_id IN
      //   (${chhimeksIds.join(",")})
      //    THEN 1 ELSE 0 END DESC`
      // ),
    ],

    //order by createdAt
    ["createdAt", "DESC"],

    //order by distance
    [literal(`distance`), "ASC"],
  ];

  query.limit = limit;
  query.offset = offset;
  query.order = order;

  // execute query
  const posts = await Post.findAndCountAll(query);

  let data = getPagingData({ paginatedData: posts, page, limit });

  data.data = data.data.map((post) => {
    post.dataValues.user_id = undefined;
    post.dataValues.location = undefined;
    post.dataValues.distance = undefined;
    return post;
  });

  return new ApiResponse({
    status: 200,
    message: "Posts retrieved successfully",
    data: data,
  }).send(res);
});

/**
 * @description     Hide post
 * @route           POST prefix/posts/:postId/hide
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /posts/1/hide
 */

export const hidePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const user = req.user;

  const post = req.post;

  // check post privacy
  if (post.privacy === PostPrivacy.ONLY_ME) {
    return new ApiResponse({
      status: 403,
      message: "Unable to hide post",
    }).send(res);
  }

  // check if post is own
  if (post.userId === user.id) {
    return new ApiResponse({
      status: 403,
      message: "Unable to hide post",
    }).send(res);
  }

  // check if post is already hidden
  const hiddenPost = await Post.findOne({
    where: {
      id: postId,
    },
    include: [
      {
        model: User,
        required: true,
        as: "hiddenBy",
        where: {
          id: user.id,
        },
      },
    ],
  });

  if (hiddenPost) {
    return new ApiResponse({
      status: 422,
      message: "Post already hidden",
    }).send(res);
  }

  // check if post is from chhimek and user is not chhimek
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
        message: "Unable to hide post",
      }).send(res);
    }
  }

  // hide post
  await user.addHiddenPost(post);

  return new ApiResponse({
    status: 200,
    message: "Post hidden successfully",
  }).send(res);
});

/**
 * @description     Report post
 * @route           POST prefix/posts/:postId/report
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @bodyParam       description - description of report
 * @returns {ApiResponse} - Returns ApiResponse class instance
 * @example
 * /posts/1/report
 * body:
 * {
 *   "description": "This is a spam post",
 *   "categoryId": 1
 * }
 */
export const reportPost = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const { postId } = req.params;
  const user = req.user;
  const post = req.post;
  const category = req.category;

  // check if post is already reported
  const reportedPost = await PostReport.findOne({
    where: {
      userId: user.id,
      postId: postId,
    },
  });

  if (reportedPost) {
    return new ApiResponse({
      status: 422,
      message: "Post already reported",
    }).send(res);
  }

  // check post privacy
  if (post.privacy === PostPrivacy.ONLY_ME && post.userId !== user.id) {
    return new ApiResponse({
      status: 403,
      message: "Unable to report post",
    }).send(res);
  }

  // check if post is from chhimek and user is not chhimek
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
        message: "Unable to report post",
      }).send(res);
    }
  }

  await PostReport.create({
    userId: user.id,
    postId: postId,
    categoryId: category.id,
    description: description,
  });

  return new ApiResponse({
    status: 201,
    message: "Post reported successfully",
  }).send(res);
});

/**
 * @description     Get post comments
 * @route           GET prefix/posts/:postId/comments
 * @queryParam      page - page number
 * @queryParam      size - number of items per page
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance with paginated data
 * @example
 * /posts/1/comments?page=1&size=10
 */

export const getPostComments = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const post = req.post;
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

      //exclude replies
      parentCommentId: {
        [Op.eq]: null,
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

  const postComments = await Comment.findAndCountAll(query);

  let data = getPagingData({ paginatedData: postComments, page, limit });

  return new ApiResponse({
    status: 200,
    message: "Post comments retrieved successfully",
    data: data,
  }).send(res);
});

/**
 * @description     Get post reactions
 * @route           GET prefix/posts/:postId/reactions
 * @queryParam      page - page number
 * @queryParam      size - number of items per page
 * @access          Private
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {ApiResponse} - Returns ApiResponse class instance with paginated data
 * @example
 * /posts/1/reactions?page=1&size=10
 */
export const getPostReactions = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  const post = req.post;
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
    ],

    attributes: [
      "id",
      "type",
      "createdAt",

      //get own post reaction
      [
        literal(
          `(SELECT type FROM post_reactions WHERE post_reactions.post_id = ${post.id} AND post_reactions.user_id = ${user.id})`
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

  const postReactions = await PostReaction.findAndCountAll(query);

  let data = getPagingData({ paginatedData: postReactions, page, limit });

  return new ApiResponse({
    status: 200,
    message: "Post reactions retrieved successfully",
    data: data,
  }).send(res);
});
