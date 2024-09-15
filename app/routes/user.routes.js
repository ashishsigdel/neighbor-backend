import { Router } from "express";

const router = Router();
import validate from "../validators/validate.js";
import {
  changePasswordValidator,
  updateProfileValidator,
} from "../validators/user.validators.js";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadImageMiddleware } from "../middlewares/multer.middleware.js";
import FileStorageDirectory from "../enums/fileStorageDirectory.js";

//routes for user

/**
 * @route PUT /api/users/profile
 * @description Update profile
 * @access Private
 */
router.put(
  "/profile",
  authMiddleware,
  uploadImageMiddleware({
    directory: FileStorageDirectory.TEMP,
  }).fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  updateProfileValidator(),
  validate,
  userController.updateProfile
);

/**
 * @route PUT /api/users/change-password
 * @description Change password
 * @access Private
 */
router.put(
  "/change-password",
  authMiddleware,
  changePasswordValidator(),
  validate,
  userController.changePassword
);

export default router;
