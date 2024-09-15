import { Router } from "express";

const router = Router();
import validate from "../validators/validate.js";
import {
  replyToCommentValidator,
  reactToCommentValidator,
  removeCommentReactionValidator,
  deleteCommentValidator,
  updateCommentValidator,
  getCommentRepliesValidator,
  getCommentReactionsValidator,
} from "../validators/comment.validator.js";
import {
  authMiddleware,
  checkUserRoles,
} from "../middlewares/auth.middleware.js";
import { uploadImageVideoMiddleware } from "../middlewares/multer.middleware.js";
import {
  replyToComment,
  reactToComment,
  removeCommentReaction,
  deleteComment,
  updateComment,
  getCommentReplies,
  getCommentReactions,
} from "../controllers/comment.controller.js";
import FileStorageDirectory from "../enums/fileStorageDirectory.js";

/**
 * @route POST /api/comments/:commentId/reply
 * @description Reply to comment
 * @access Private
 */
router.post(
  "/:commentId/reply",
  authMiddleware,
  checkUserRoles(["user"]),
  uploadImageVideoMiddleware({
    directory: FileStorageDirectory.TEMP,
  }).single("media"),
  replyToCommentValidator(),
  validate,
  replyToComment
);

/**
 * @route POST /api/comments/:commentId/react
 * @description React to comment
 * @access Private
 */
router.post(
  "/:commentId/react",
  authMiddleware,
  checkUserRoles(["user"]),
  reactToCommentValidator(),
  validate,
  reactToComment
);

/**
 * @route DELETE /api/comments/:commentId/react
 * @description Remove comment reaction
 * @access Private
 */
router.delete(
  "/:commentId/react",
  authMiddleware,
  checkUserRoles(["user"]),
  removeCommentReactionValidator(),
  validate,
  removeCommentReaction
);

/**
 * @route DELETE /api/comments/:commentId
 * @description Delete comment
 * @access Private
 */
router.delete(
  "/:commentId",
  authMiddleware,
  checkUserRoles(["user"]),
  deleteCommentValidator(),
  validate,
  deleteComment
);

/**
 * @route PUT /api/comments/:commentId
 * @description Update comment
 * @access Private
 */
router.put(
  "/:commentId",
  authMiddleware,
  checkUserRoles(["user"]),
  updateCommentValidator(),
  validate,
  updateComment
);

/**
 * @route GET /api/comments/:commentId/replies
 * @description Get comment replies
 * @access Private
 */
router.get(
  "/:commentId/replies",
  authMiddleware,
  checkUserRoles(["user"]),
  getCommentRepliesValidator(),
  validate,
  getCommentReplies
);

/**
 * @route GET /api/comments/:commentId/reactions
 * @description Get comment reactions
 * @access Private
 */
router.get(
  "/:commentId/reactions",
  authMiddleware,
  checkUserRoles(["user"]),
  getCommentReactionsValidator(),
  validate,
  getCommentReactions
);

export default router;
