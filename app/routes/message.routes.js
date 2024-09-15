import { Router } from "express";

const router = Router();
import validate from "../validators/validate.js";
import {} from "../validators/message.validator.js";
import {
  authMiddleware,
  checkUserRoles,
} from "../middlewares/auth.middleware.js";
import { uploadMessageMediaMiddleware } from "../middlewares/multer.middleware.js";
import { createMessageMedia } from "../controllers/message.controller.js";
import FileStorageDirectory from "../enums/fileStorageDirectory.js";

//endpoints
/**
 * @route POST /api/message-media
 * @description Create message media
 * @access Private
 */

router.post(
  "/message-media",
  authMiddleware,
  checkUserRoles(["user"]),
  uploadMessageMediaMiddleware({
    directory: FileStorageDirectory.TEMP,
  }).array("medias", 100),
  createMessageMedia
);

export default router;
