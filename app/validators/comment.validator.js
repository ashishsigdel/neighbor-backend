import { body, param, query } from "express-validator";
import db from "../models/index.js";
const { Comment, Post } = db;
import ReactionType from "../enums/reactionType.js";

/**
 * @function replyToCommentValidator
 * @description Reply to comment validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const replyToCommentValidator = () => {
  return [
    body("content")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Content is required")
      .bail()
      .isString()
      .withMessage("Content must be string")
      .bail(),
    param("commentId")
      .notEmpty()
      .withMessage("Comment id is required")
      .bail()
      .isInt()
      .withMessage("Invalid comment id")
      .bail()
      .custom(async (commentId) => {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
          },
        });
        if (!comment) {
          return Promise.reject("Comment not found");
        }

        return true;
      }),
  ];
};

/**
 * @function reactToCommentValidator
 * @description React to comment validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const reactToCommentValidator = () => {
  return [
    body("reaction")
      .notEmpty()
      .withMessage("Reaction is required")
      .bail()
      .isIn(Object.values(ReactionType))
      .withMessage("Invalid reaction")
      .bail(),
    param("commentId")
      .notEmpty()
      .withMessage("Comment id is required")
      .bail()
      .isInt()
      .withMessage("Invalid comment id")
      .bail()
      .custom(async (commentId) => {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
          },
        });
        if (!comment) {
          return Promise.reject("Comment not found");
        }

        return true;
      }),
  ];
};

/**
 * @function removeCommentReactionValidator
 * @description Remove comment reaction validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const removeCommentReactionValidator = () => {
  return [
    param("commentId")
      .notEmpty()
      .withMessage("Comment id is required")
      .bail()
      .isInt()
      .withMessage("Invalid comment id")
      .bail()
      .custom(async (commentId) => {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
          },
        });
        if (!comment) {
          return Promise.reject("Comment not found");
        }

        return true;
      }),
  ];
};

/**
 * @function deleteCommentValidator
 * @description Delete comment validator
 * @returns {import("express-validator").ValidationChain[]}
 */

export const deleteCommentValidator = () => {
  return [
    param("commentId")
      .notEmpty()
      .withMessage("Comment id is required")
      .bail()
      .isInt()
      .withMessage("Invalid comment id")
      .bail()
      .custom(async (commentId, { req }) => {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
          },
        });
        if (!comment) {
          return Promise.reject("Comment not found");
        }

        // set comment on request object
        req.comment = comment;

        // check if comment is of the user
        if (comment.userId !== req.user.id) {
          return Promise.reject("Unable to delete comment.");
        }

        return true;
      }),
  ];
};

/**
 * @function updateCommentValidator
 * @description Update comment validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const updateCommentValidator = () => {
  return [
    body("content")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Content is required")
      .bail()
      .isString()
      .withMessage("Content must be string")
      .bail(),
    param("commentId")
      .notEmpty()
      .withMessage("Comment id is required")
      .bail()
      .isInt()
      .withMessage("Invalid comment id")
      .bail()
      .custom(async (commentId, { req }) => {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
          },
        });
        if (!comment) {
          return Promise.reject("Comment not found");
        }

        // check if comment is of the user
        if (comment.userId !== req.user.id) {
          return Promise.reject("Unable to update comment.");
        }

        // set comment on request object
        req.comment = comment;

        return true;
      }),
  ];
};

/**
 * @function getCommentRepliesValidator
 * @description Get comment replies validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const getCommentRepliesValidator = () => {
  return [
    param("commentId")
      .notEmpty()
      .withMessage("Comment id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (commentId, { req }) => {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
          },
        });
        if (!comment) {
          return Promise.reject("Comment not found");
        }

        const post = await Post.findOne({
          where: {
            id: comment.postId,
          },
        });

        req.comment = comment;
        req.post = post;
        return true;
      }),
    query("page")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Page is required")
      .bail()
      .isInt()
      .withMessage("Invalid page")
      .bail(),
    query("size")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Size is required")
      .bail()
      .isInt()
      .withMessage("Invalid size")
      .bail(),
  ];
};

/**
 * @function getCommentReactionsValidator
 * @description Get comment reactions validator
 * @returns {import("express-validator").ValidationChain[]}
 */

export const getCommentReactionsValidator = () => {
  return [
    param("commentId")
      .notEmpty()
      .withMessage("Comment id is required")
      .bail()
      .isInt()
      .withMessage("Invalid comment id")
      .bail()
      .custom(async (commentId, { req }) => {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
          },
        });

        if (!comment) {
          return Promise.reject("Comment not found");
        }

        const post = await Post.findOne({
          where: {
            id: comment.postId,
          },
        });

        req.comment = comment;
        req.post = post;
        return true;
      }),
    query("page")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Page is required")
      .bail()
      .isInt()
      .withMessage("Invalid page")
      .bail(),
    query("size")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Size is required")
      .bail()
      .isInt()
      .withMessage("Invalid size")
      .bail(),
  ];
};
