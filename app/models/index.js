import { Sequelize, DataTypes, Op, sequelize } from "../config/dbConfig.js";
import assotiations from "./associations/index.js";
import Role from "./role.model.js";
import User from "./user.model.js";
import RefreshToken from "./refreshToken.model.js";
import PasswordReset from "./passwordReset.model.js";
import EmailVerification from "./emailVerification.model.js";
import UserProfile from "./userProfile.model.js";
import FcmToken from "./fcmToken.model.js";
import LoginHistory from "./loginHistory.model.js";
import Media from "./media.model.js";

import Post from "./post.model.js";
import Comment from "./comment.model.js";
import Mention from "./mention.model.js";
import Hashtag from "./hashtag.model.js";
import PostReaction from "./postReaction.model.js";
import CommentReaction from "./commentReaction.model.js";
import Location from "./location.model.js";

import Chhimek from "./chhimek.model.js";
import Notification from "./notification.model.js";
import BlockedUser from "./blockedUser.model.js";

import ReportCategory from "./reportCategory.model.js";
import PostReport from "./postReport.model.js";
import UserReport from "./userReport.model.js";
import Conversation from "./conversation.model.js";
import ConversationReport from "./conversationReport.model.js";
import ConversationParticipant from "./conversationParticipant.model.js";
import DeletedConversation from "./deletedConversation.model.js";
import Message from "./message.model.js";
import SocketToken from "./socketToken.model.js";
import MessageReadStatus from "./messageReadStatus.model.js";
import PinnedMessage from "./pinnedMessage.model.js";
import MessageMedia from "./messageMedia.model.js";

import DeletedMessage from "./deletedMessage.model.js";
import MessageReaction from "./messageReaction.model.js";

import Moment from "./moment.model.js";
import MomentComment from "./momentComment.model.js";
import MomentReaction from "./momentReaction.model.js";
import MomentCommentReaction from "./momentCommentReaction.model.js";
import MomentReport from "./momentReport.model.js";

import Event from "./event.model.js";
import EventMedia from "./eventMedia.model.js";
import EventResponse from "./eventResponse.model.js";

import Company from "./company.model.js";
import Job from "./job.model.js";
import JobCategory from "./jobCategory.model.js";
import Rental from "./rental.model.js";

import PostMedia from "./post_media.model.js";
import CommentMedia from "./comment_media.model.js";
import MomentMedia from "./moment_media.model.js";
import MomentCommentMedia from "./moment_comment_media.model.js";
import RentalMedia from "./rental_media.model.js";

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.DataTypes = DataTypes;
db.Op = Op;

db.Role = Role(sequelize, Sequelize, DataTypes);
db.User = User(sequelize, Sequelize, DataTypes);
db.RefreshToken = RefreshToken(sequelize, Sequelize, DataTypes);
db.PasswordReset = PasswordReset(sequelize, Sequelize, DataTypes);
db.EmailVerification = EmailVerification(sequelize, Sequelize, DataTypes);
db.UserProfile = UserProfile(sequelize, Sequelize, DataTypes);
db.FcmToken = FcmToken(sequelize, Sequelize, DataTypes);
db.LoginHistory = LoginHistory(sequelize, Sequelize, DataTypes);
db.Media = Media(sequelize, Sequelize, DataTypes);

db.Post = Post(sequelize, Sequelize, DataTypes);
db.Comment = Comment(sequelize, Sequelize, DataTypes);
db.Mention = Mention(sequelize, Sequelize, DataTypes);
db.Hashtag = Hashtag(sequelize, Sequelize, DataTypes);
db.PostReaction = PostReaction(sequelize, Sequelize, DataTypes);
db.CommentReaction = CommentReaction(sequelize, Sequelize, DataTypes);
db.Location = Location(sequelize, Sequelize, DataTypes);

db.Chhimek = Chhimek(sequelize, Sequelize, DataTypes);
db.Notification = Notification(sequelize, Sequelize, DataTypes);
db.BlockedUser = BlockedUser(sequelize, Sequelize, DataTypes);

db.ReportCategory = ReportCategory(sequelize, Sequelize, DataTypes);
db.PostReport = PostReport(sequelize, Sequelize, DataTypes);
db.UserReport = UserReport(sequelize, Sequelize, DataTypes);

db.Conversation = Conversation(sequelize, Sequelize, DataTypes);
db.ConversationReport = ConversationReport(sequelize, Sequelize, DataTypes);
db.ConversationParticipant = ConversationParticipant(
  sequelize,
  Sequelize,
  DataTypes
);
db.DeletedConversation = DeletedConversation(sequelize, Sequelize, DataTypes);
db.SocketToken = SocketToken(sequelize, Sequelize, DataTypes);
db.Message = Message(sequelize, Sequelize, DataTypes);
db.MessageReadStatus = MessageReadStatus(sequelize, Sequelize, DataTypes);
db.PinnedMessage = PinnedMessage(sequelize, Sequelize, DataTypes);
db.MessageMedia = MessageMedia(sequelize, Sequelize, DataTypes);
db.DeletedMessage = DeletedMessage(sequelize, Sequelize, DataTypes);
db.MessageReaction = MessageReaction(sequelize, Sequelize, DataTypes);

db.Moment = Moment(sequelize, Sequelize, DataTypes);
db.MomentComment = MomentComment(sequelize, Sequelize, DataTypes);
db.MomentReaction = MomentReaction(sequelize, Sequelize, DataTypes);
db.MomentCommentReaction = MomentCommentReaction(
  sequelize,
  Sequelize,
  DataTypes
);
db.MomentReport = MomentReport(sequelize, Sequelize, DataTypes);

db.Event = Event(sequelize, Sequelize, DataTypes);
db.EventMedia = EventMedia(sequelize, Sequelize, DataTypes);
db.EventResponse = EventResponse(sequelize, Sequelize, DataTypes);

db.Company = Company(sequelize, Sequelize, DataTypes);
db.Job = Job(sequelize, Sequelize, DataTypes);
db.JobCategory = JobCategory(sequelize, Sequelize, DataTypes);
db.Rental = Rental(sequelize, Sequelize, DataTypes);

db.PostMedia = PostMedia(sequelize, Sequelize, DataTypes);
db.CommentMedia = CommentMedia(sequelize, Sequelize, DataTypes);
db.MomentMedia = MomentMedia(sequelize, Sequelize, DataTypes);
db.MomentCommentMedia = MomentCommentMedia(sequelize, Sequelize, DataTypes);
db.RentalMedia = RentalMedia(sequelize, Sequelize, DataTypes);

assotiations(db);
export default db;
