import { body, param, query } from "express-validator";
import db from "../models/index.js";
const { Post, Comment, ReportCategory } = db;
import PostPrivacy from "../enums/postPrivacy.js";
import ReactionType from "../enums/reactionType.js";

/**
 * @function createPostValidator
 * @description Create post validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const createPostValidator = () => {
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
    body("privacy")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Privacy is required")
      .bail()
      .isIn(Object.values(PostPrivacy))
      .withMessage("Invalid privacy")
      .bail(),
    body("latitude")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Latitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid latitude")
      .bail(),
    body("longitude")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Longitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid longitude")
      .bail(),
  ];
};

/**
 * @function sharePostValidator
 * @description Share post validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const sharePostValidator = () => {
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
    body("privacy")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Privacy is required")
      .bail()
      .isIn(Object.values(PostPrivacy))
      .withMessage("Invalid privacy")
      .bail(),
    body("latitude")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Latitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid latitude")
      .bail(),
    body("longitude")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Longitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid longitude")
      .bail(),
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }
      }),
  ];
};

/**
 * @function reactToPostValidator
 * @description React to post validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const reactToPostValidator = () => {
  return [
    body("reaction")
      .notEmpty()
      .withMessage("Reaction is required")
      .bail()
      .isIn(Object.values(ReactionType))
      .withMessage("Invalid reaction")
      .bail(),
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }
      }),
  ];
};

/**
 * @function removePostReactionValidator
 * @description Remove post reaction validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const removePostReactionValidator = () => {
  return [
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }
      }),
  ];
};

/**
 * @function commentOnPostValidator
 * @description Comment on post validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const commentOnPostValidator = () => {
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
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }
      }),
  ];
};

/**
 * @function deletePostValidator
 * @description Delete post validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const deletePostValidator = () => {
  return [
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId, { req }) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }

        if (post.userId !== req.user.id) {
          return Promise.reject("Unable to delete post");
        }

        req.post = post;

        return true;
      }),
  ];
};

/**
 * @function updatePostValidator
 * @description Update post validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const updatePostValidator = () => {
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
    body("privacy")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Privacy is required")
      .bail()
      .isIn(Object.values(PostPrivacy))
      .withMessage("Invalid privacy")
      .bail(),
    body("latitude")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Latitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid latitude")
      .bail(),
    body("longitude")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Longitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid longitude")
      .bail(),
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId, { req }) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }

        if (post.userId !== req.user.id) {
          return Promise.reject("Unable to update post");
        }

        req.post = post;

        return true;
      }),
  ];
};

/**
 * @function getPostsValidator
 * @description Get posts validator
 * @returns {import("express-validator").ValidationChain[]}
 */

export const getPostsValidator = () => {
  return [
    query("latitude")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Latitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid latitude")
      .bail(),
    query("longitude")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Longitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid longitude")
      .bail(),
    query("radius")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Radius is required")
      .bail()
      .isFloat()
      .withMessage("Invalid radius")
      .bail(),
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
    query("search")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Search is required")
      .bail()
      .isString()
      .withMessage("Invalid search")
      .bail(),
  ];
};

/**
 * @function getChhimkePostsValidator
 * @description Get post validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const getChhimeksPostsValidator = () => {
  return [
    query("latitude")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Latitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid latitude")
      .bail(),
    query("longitude")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Longitude is required")
      .bail()
      .isFloat()
      .withMessage("Invalid longitude")
      .bail(),
    query("radius")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Radius is required")
      .bail()
      .isFloat()
      .withMessage("Invalid radius")
      .bail(),
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
    query("search")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Search is required")
      .bail()
      .isString()
      .withMessage("Invalid search")
      .bail(),
  ];
};

/**
 * @function hidePostValidator
 * @description Hide post validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const hidePostValidator = () => {
  return [
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId, { req }) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }

        req.post = post;

        return true;
      }),
  ];
};

/**
 * @function reportPostValidator
 * @description Report post validator
 * @returns {import("express-validator").ValidationChain[]}
 */

export const reportPostValidator = () => {
  return [
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId, { req }) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }

        req.post = post;

        return true;
      }),
    body("categoryId")
      .notEmpty()
      .withMessage("Category id is required")
      .bail()
      .isInt()
      .withMessage("Invalid category id")
      .bail()
      .custom(async (categoryId, { req }) => {
        const category = await ReportCategory.findOne({
          where: {
            id: categoryId,
          },
        });
        if (!category) {
          return Promise.reject("Category not found");
        }

        req.category = category;
        return true;
      }),
    body("description")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required")
      .bail()
      .isString()
      .withMessage("Description must be string")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long")
      .bail(),
  ];
};

/**
 * @function getPostCommentsValidator
 * @description Get post comments validator
 * @returns {import("express-validator").ValidationChain[]}
 */
export const getPostCommentsValidator = () => {
  return [
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId, { req }) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }

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
 * @function getPostReactionsValidator
 * @description Get post reactions validator
 * @returns {import("express-validator").ValidationChain[]}
 */

export const getPostReactionsValidator = () => {
  return [
    param("postId")
      .notEmpty()
      .withMessage("Post id is required")
      .bail()
      .isInt()
      .withMessage("Invalid post id")
      .bail()
      .custom(async (postId, { req }) => {
        const post = await Post.findOne({
          where: {
            id: postId,
          },
        });
        if (!post) {
          return Promise.reject("Post not found");
        }

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
