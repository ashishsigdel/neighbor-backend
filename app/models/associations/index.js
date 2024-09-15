import roleAssociation from "./role.association.js";
import userAssociation from "./user.association.js";
import refreshTokenAssociation from "./refreshToken.association.js";
import passwordResetAssociation from "./passwordReset.association.js";
import emailVerificationAssociation from "./emailVerification.association.js";
import userProfileAssociation from "./userProfile.association.js";
import fcmTokenAssociation from "./fcmToken.association.js";
import loginHistoryAssociation from "./loginHistory.association.js";
import mediaAssociation from "./media.association.js";

import postAssociation from "./post.association.js";
import commentAssociation from "./comment.association.js";
import mentionAssociation from "./mention.association.js";
import hashtagAssociation from "./hashtag.association.js";
import postReactionAssociation from "./postReaction.association.js";
import commentReactionAssociation from "./commentReaction.association.js";
import locationAssociation from "./location.association.js";
import chhimekAssociation from "./chhimek.association.js";
import notificationAssociation from "./notification.association.js";
import blockedUserAssociation from "./blockedUser.association.js";

import reportCategoryAssociation from "./reportCategory.association.js";
import userReportAssociation from "./userReport.association.js";
import postReportAssociation from "./postReport.association.js";
import conversationAssociation from "./conversation.association.js";
import conversationParticipantAssociation from "./conversationParticipant.association.js";
import deletedConversationAssociation from "./deletedConversation.association.js";
import socketTokenAssociation from "./socketToken.association.js";
import messageAssociation from "./message.association.js";
import pinnedMessageAssociation from "./pinnedMessage.association.js";
import messageReadStatusAssociation from "./messageReadStatus.association.js";
import messageReactionAssociation from "./messageReaction.association.js";
import deletedMessageAssociation from "./deletedMessage.association.js";
import conversationReportAssociation from "./conversationReport.association.js";

import momentAssociation from "./moment.association.js";
import momentCommentAssociation from "./momentComment.association.js";
import momentReactionAssociation from "./momentReaction.association.js";
import momentCommentReactionAssociation from "./momentCommentReaction.association.js";
import momentReportAssociation from "./momentReport.association.js";

import companyAssociation from "./company.association.js";
import jobAssociation from "./job.association.js";
import jobCategoryAssociation from "./jobCategory.association.js";
import eventAssociation from "./event.association.js";
import rentalAssociation from "./rental.association.js";

/**
 * @description Define all associations here
 * @example
 * @returns {void}
 */
export default function assotiations(db) {
  roleAssociation(db);
  userAssociation(db);
  refreshTokenAssociation(db);
  passwordResetAssociation(db);
  emailVerificationAssociation(db);
  userProfileAssociation(db);
  fcmTokenAssociation(db);
  loginHistoryAssociation(db);
  mediaAssociation(db);

  postAssociation(db);
  commentAssociation(db);
  mentionAssociation(db);
  hashtagAssociation(db);
  postReactionAssociation(db);
  commentReactionAssociation(db);
  locationAssociation(db);
  chhimekAssociation(db);
  notificationAssociation(db);
  blockedUserAssociation(db);
  reportCategoryAssociation(db);
  userReportAssociation(db);
  postReportAssociation(db);

  conversationAssociation(db);
  conversationParticipantAssociation(db);
  deletedConversationAssociation(db);
  socketTokenAssociation(db);
  messageAssociation(db);
  messageReactionAssociation(db);
  pinnedMessageAssociation(db);
  messageReadStatusAssociation(db);
  deletedMessageAssociation(db);
  conversationReportAssociation(db);

  momentAssociation(db);
  momentCommentAssociation(db);
  momentReactionAssociation(db);
  momentCommentReactionAssociation(db);
  momentReportAssociation(db);

  companyAssociation(db);
  jobAssociation(db);
  jobCategoryAssociation(db);

  eventAssociation(db);
  rentalAssociation(db);
}
