import { Router } from "express";
const router = Router();
import AuthRoute from "./auth.routes.js";
import PasswordResetRoute from "./passwordReset.routes.js";
import UserRoute from "./user.routes.js";
import PostRoute from "./post.routes.js";
import CommentRoute from "./comment.routes.js";
import MessageRoute from "./message.routes.js";

router.use("/auth", AuthRoute); // api/v1/auth
router.use("/password-reset", PasswordResetRoute); // api/v1/password-reset
router.use("/users", UserRoute); // api/v1/users
router.use("/posts", PostRoute); // api/v1/posts
router.use("/comments", CommentRoute); // api/v1/comments
router.use("/messages", MessageRoute); // api/v1/messages

export default router;
