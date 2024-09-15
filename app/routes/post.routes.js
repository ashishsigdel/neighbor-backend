import { Router } from "express";

const router = Router();
import validate from "../validators/validate.js";
import {
  createPostValidator,
  sharePostValidator,
  reactToPostValidator,
  removePostReactionValidator,
  commentOnPostValidator,
  deletePostValidator,
  updatePostValidator,
  getPostsValidator,
  getChhimeksPostsValidator,
  hidePostValidator,
  reportPostValidator,
  getPostCommentsValidator,
  getPostReactionsValidator,
} from "../validators/post.validator.js";
import {
  authMiddleware,
  checkUserRoles,
} from "../middlewares/auth.middleware.js";
import { uploadImageVideoMiddleware } from "../middlewares/multer.middleware.js";
import {
  createPost,
  sharePost,
  reactToPost,
  removePostReaction,
  commentOnPost,
  deletePost,
  updatePost,
  getPosts,
  getChhimeksPost,
  hidePost,
  reportPost,
  getPostComments,
  getPostReactions,
} from "../controllers/post.controller.js";
import FileStorageDirectory from "../enums/fileStorageDirectory.js";

//endpoints
/**
 * @route POST /api/posts
 * @description Create post
 * @access Private
 */
router.post(
  "/",
  authMiddleware,
  checkUserRoles(["user"]),
  uploadImageVideoMiddleware({
    directory: FileStorageDirectory.TEMP,
  }).array("media", 10),
  createPostValidator(),
  validate,
  createPost
);

/**
 * @route POST /api/posts/:postId/share
 * @description Share post
 * @access Private
 */
router.post(
  "/:postId/share",
  authMiddleware,
  checkUserRoles(["user"]),
  sharePostValidator(),
  validate,
  sharePost
);

/**
 * @route POST /api/posts/:postId/react
 * @description React to post
 * @access Private
 */
router.post(
  "/:postId/react",
  authMiddleware,
  checkUserRoles(["user"]),
  reactToPostValidator(),
  validate,
  reactToPost
);

/**
 * @route DELETE /api/posts/:postId/react
 * @description Remove post reaction
 * @access Private
 */
router.delete(
  "/:postId/react",
  authMiddleware,
  checkUserRoles(["user"]),
  removePostReactionValidator(),
  validate,
  removePostReaction
);

/**
 * @route POST /api/posts/:postId/comment
 * @description Comment on post
 * @access Private
 */
router.post(
  "/:postId/comment",
  authMiddleware,
  checkUserRoles(["user"]),
  uploadImageVideoMiddleware({
    directory: FileStorageDirectory.TEMP,
  }).single("media"),
  commentOnPostValidator(),
  validate,
  commentOnPost
);

/**
 * @route DELETE /api/posts/:postId
 * @description Delete post
 * @access Private
 */
router.delete(
  "/:postId",
  authMiddleware,
  checkUserRoles(["user"]),
  deletePostValidator(),
  validate,
  deletePost
);

/**
 * @route PUT /api/posts/:postId
 * @description Update post
 * @access Private
 */
router.put(
  "/:postId",
  authMiddleware,
  checkUserRoles(["user"]),
  updatePostValidator(),
  validate,
  updatePost
);

/**
 * @route GET /api/posts
 * @description Get posts
 * @access Private
 */
router.get(
  "/",
  authMiddleware,
  checkUserRoles(["user"]),
  getPostsValidator(),
  validate,
  getPosts
);

/**
 * @route GET /api/posts/chhimeks
 * @description Get chhimeks posts
 * @access Private
 */
router.get(
  "/chhimeks",
  authMiddleware,
  checkUserRoles(["user"]),
  getChhimeksPostsValidator(),
  validate,
  getChhimeksPost
);

/**
 * @route POST /api/posts/:postId/hide
 * @description Hide post
 * @access Private
 */
router.post(
  "/:postId/hide",
  authMiddleware,
  checkUserRoles(["user"]),
  hidePostValidator(),
  validate,
  hidePost
);

/**
 * @route POST /api/posts/:postId/report
 * @description Report post
 * @access Private
 */
router.post(
  "/:postId/report",
  authMiddleware,
  checkUserRoles(["user"]),
  reportPostValidator(),
  validate,
  reportPost
);

/**
 * @route GET /api/posts/:postId/comments
 * @description Get post comments
 * @access Private
 */
router.get(
  "/:postId/comments",
  authMiddleware,
  checkUserRoles(["user"]),
  getPostCommentsValidator(),
  validate,
  getPostComments
);

/**
 * @route GET /api/posts/:postId/reactions
 * @description Get post reactions
 * @access Private
 */
router.get(
  "/:postId/reactions",
  authMiddleware,
  checkUserRoles(["user"]),
  getPostReactionsValidator(),
  validate,
  getPostReactions
);

export default router;
