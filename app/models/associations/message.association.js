const messageAssociation = (db) => {
  // many to one relationship between Message and Conversation
  db.Message.belongsTo(db.Conversation, {
    foreignKey: "conversationId",
    as: "conversation",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Message and User (sender)
  db.Message.belongsTo(db.User, {
    foreignKey: "senderId",
    as: "sender",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Message and User (affected user)
  db.Message.belongsTo(db.User, {
    foreignKey: "affectedUserId",
    as: "affectedUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Message and Message (parent)
  db.Message.hasMany(db.Message, {
    foreignKey: "parentId",
    as: "replies",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Message and Message (parent)
  db.Message.belongsTo(db.Message, {
    foreignKey: "parentId",
    as: "parent",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Message and Media
  db.Message.belongsToMany(db.Media, {
    through: db.MessageMedia,
    foreignKey: "messageId",
    otherKey: "mediaId",
    as: "medias",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Message and PinnedMessage
  db.Message.hasMany(db.PinnedMessage, {
    foreignKey: "messageId",
    as: "pinnedMessages",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Message and Message Read Status
  db.Message.hasMany(db.MessageReadStatus, {
    foreignKey: "messageId",
    as: "messageReadStatuses",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Message and Deleted Message
  db.Message.hasMany(db.DeletedMessage, {
    foreignKey: "messageId",
    as: "deletedMessages",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Message and Message Reaction
  db.Message.hasMany(db.MessageReaction, {
    foreignKey: "messageId",
    as: "messageReactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
export default messageAssociation;
