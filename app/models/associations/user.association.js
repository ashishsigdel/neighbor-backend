const userAssociation = (db) => {
  // Many Users to Many Roles
  db.User.belongsToMany(db.Role, {
    through: "user_roles", // The name of the intermediate table
    foreignKey: "userId", // The foreign key in the "user_roles" table that references users
    otherKey: "roleId", // The foreign key in the "user_roles" table that references roles
    as: "roles", // An alias for the association
    onDelete: "CASCADE", // If a user is deleted, delete the user role as well
    onUpdate: "CASCADE", // If a user is updated, update the user role as well
  });

  // user to user profile
  db.User.hasOne(db.UserProfile, {
    foreignKey: "userId", // The foreign key in the "user_profiles" table that references users
    as: "userProfile", // An alias for the association
    onDelete: "CASCADE", // If a user is deleted, delete the user profile as well
    onUpdate: "CASCADE", // If a user is updated, update the user profile as well
  });

  // one-to-many between User and RefreshToken
  db.User.hasMany(db.RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-many between User and EmailVerification
  db.User.hasMany(db.EmailVerification, {
    foreignKey: "userId",
    as: "emailVerifications",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-many relationship between User and PasswordReset
  db.User.hasMany(db.PasswordReset, {
    foreignKey: "userId",
    as: "passwordResets",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and FCMToken
  db.User.hasMany(db.FcmToken, {
    foreignKey: "userId",
    as: "FcmTokens",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and LoginHistory
  db.User.hasMany(db.LoginHistory, {
    foreignKey: "userId",
    as: "loginHistories",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and Media
  db.User.hasMany(db.Media, {
    foreignKey: "userId",
    as: "media",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and Post
  db.User.hasMany(db.Post, {
    foreignKey: "userId",
    as: "posts",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and Comment
  db.User.hasMany(db.Mention, {
    foreignKey: "mentionedToUser",
    as: "mentionedTo",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and Mention
  db.User.hasMany(db.Mention, {
    foreignKey: "mentionedByUser",
    as: "mentionedBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and Comment
  db.User.hasMany(db.Comment, {
    foreignKey: "userId",
    as: "comments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and PostReaction
  db.User.hasMany(db.PostReaction, {
    foreignKey: "userId",
    as: "postReactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and CommentReaction
  db.User.hasMany(db.CommentReaction, {
    foreignKey: "userId",
    as: "commentReactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and Location
  db.User.hasMany(db.Location, {
    foreignKey: "userId",
    as: "locations",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and Chhimek
  db.User.hasMany(db.Chhimek, {
    foreignKey: "fromUserId",
    as: "fromChhimeks",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and Chhimek
  db.User.hasMany(db.Chhimek, {
    foreignKey: "toUserId",
    as: "toChhimeks",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //one to many relationship between User and Notification
  db.User.hasMany(db.Notification, {
    foreignKey: "userId",
    as: "notifications",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and Notification (sender)
  db.User.hasMany(db.Notification, {
    foreignKey: "senderId",
    as: "sentNotifications",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and BlockedUser
  db.User.hasMany(db.BlockedUser, {
    foreignKey: "userId",
    as: "blockedUsers",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between User and BlockedUser (blockedUser)
  db.User.hasMany(db.BlockedUser, {
    foreignKey: "blockedUserId",
    as: "blockedByUsers",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //many to many relationship between User and HiddenPost
  db.User.belongsToMany(db.Post, {
    through: "hidden_posts", // The name of the intermediate table
    foreignKey: "userId", // The foreign key in the "hidden_posts" table that references users
    otherKey: "postId", // The foreign key in the "hidden_posts" table that references posts
    as: "hiddenPosts", // An alias for the association
    onDelete: "CASCADE", // If a user is deleted, delete the hidden post as well
    onUpdate: "CASCADE", // If a user is updated, update the hidden post as well
  });

  //one to many relation between User and Port Report
  db.User.hasMany(db.PostReport, {
    foreignKey: "userId",
    as: "postReports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //one to many relation between User and User Report
  db.User.hasMany(db.UserReport, {
    foreignKey: "userId",
    as: "reportsByUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and User Report  (reportedUser)
  db.User.hasMany(db.UserReport, {
    foreignKey: "reportedUserId",
    as: "reportsOnUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Post Report (handledBy)
  db.User.hasMany(db.PostReport, {
    foreignKey: "handledBy",
    as: "postReportHandledBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and User Report (handledBy)
  db.User.hasMany(db.UserReport, {
    foreignKey: "handledBy",
    as: "userReportHandledBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Conversation Participant
  db.User.hasMany(db.ConversationParticipant, {
    foreignKey: "userId",
    as: "conversationParticipants",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //one to many relation between User and Conversation Participant (eventPerformedBy)
  db.User.hasMany(db.ConversationParticipant, {
    foreignKey: "eventPerformedBy",
    as: "performedEvents",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Deleted Conversation
  db.User.hasMany(db.DeletedConversation, {
    foreignKey: "userId",
    as: "deletedConversations",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Message (sender)
  db.User.hasMany(db.Message, {
    foreignKey: "senderId",
    as: "sentMessages",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Message (affected user)
  db.User.hasMany(db.Message, {
    foreignKey: "affectedUserId",
    as: "affectedMessages",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Pinned Message
  db.User.hasMany(db.PinnedMessage, {
    foreignKey: "userId",
    as: "pinnedMessages",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Message Read Status
  db.User.hasMany(db.MessageReadStatus, {
    foreignKey: "userId",
    as: "messageReadStatuses",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Deleted Message
  db.User.hasMany(db.DeletedMessage, {
    foreignKey: "userId",
    as: "deletedMessages",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Conversation Report
  db.User.hasMany(db.ConversationReport, {
    foreignKey: "userId",
    as: "conversationReports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Conversation Report (handledBy)
  db.User.hasMany(db.ConversationReport, {
    foreignKey: "handledBy",
    as: "conversationReportHandledBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //one to many relation between User and Message Reaction
  db.User.hasMany(db.MessageReaction, {
    foreignKey: "userId",
    as: "messageReactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Moment
  db.User.hasMany(db.Moment, {
    foreignKey: "userId",
    as: "moments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Moment Comment
  db.User.hasMany(db.MomentComment, {
    foreignKey: "userId",
    as: "momentComments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Moment Comment Reaction
  db.User.hasMany(db.MomentCommentReaction, {
    foreignKey: "userId",
    as: "momentCommentReactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Moment Reaction
  db.User.hasMany(db.MomentReaction, {
    foreignKey: "userId",
    as: "momentReactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Moment Report
  db.User.hasMany(db.MomentReport, {
    foreignKey: "userId",
    as: "momentReports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Moment Report (handledBy)
  db.User.hasMany(db.MomentReport, {
    foreignKey: "handledBy",
    as: "momentReportHandledBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between User and HiddenMoment
  db.User.belongsToMany(db.Moment, {
    through: "hidden_moments",
    foreignKey: "userId",
    otherKey: "momentId",
    as: "hiddenMoments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between User and Post (post viewers)
  db.User.belongsToMany(db.Post, {
    through: "post_viewers",
    foreignKey: "userId",
    otherKey: "postId",
    as: "viewedPosts",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between User and Moment (moment viewers)
  db.User.belongsToMany(db.Moment, {
    through: "moment_viewers",
    foreignKey: "userId",
    otherKey: "momentId",
    as: "viewedMoments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Event
  db.User.hasMany(db.Event, {
    foreignKey: "userId",
    as: "events",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between User and Event (event bookmark)
  db.User.belongsToMany(db.Event, {
    through: "event_bookmarks",
    foreignKey: "userId",
    otherKey: "eventId",
    as: "bookmarkedEvents",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between User and Event (event response)
  db.User.belongsToMany(db.Event, {
    through: db.EventResponse,
    foreignKey: "userId",
    otherKey: "eventId",
    as: "eventResponses",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between User and Event (event views)
  db.User.belongsToMany(db.Event, {
    through: "event_viewers",
    foreignKey: "userId",
    otherKey: "eventId",
    as: "eventViews",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between User and Job
  db.User.hasMany(db.Job, {
    foreignKey: "userId",
    as: "jobs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //one to many relation between User and Rental
  db.User.hasMany(db.Rental, {
    foreignKey: "userId",
    as: "rentals",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between User and Rental (rental viewers)
  db.User.belongsToMany(db.Rental, {
    through: "rental_viewers",
    foreignKey: "userId",
    otherKey: "rentalId",
    as: "rentalViews",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between User and job (job viewers)
  db.User.belongsToMany(db.Job, {
    through: "job_viewers",
    foreignKey: "userId",
    otherKey: "jobId",
    as: "jobViews",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //one user can have many socketTokens - one to many relation between User and SocketToken
  db.User.hasMany(db.SocketToken, {
    foreignKey: "userId",
    as: "socketTokens",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //one to many relation between User and Conversation (createdBy)
  db.User.hasMany(db.Conversation, {
    foreignKey: "createdBy",
    as: "conversations",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default userAssociation;
