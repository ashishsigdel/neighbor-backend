const conversationAssociation = (db) => {
  // one to many relationship between Conversation and ConversationParticipant
  db.Conversation.hasMany(db.ConversationParticipant, {
    foreignKey: "conversationId",
    as: "conversationParticipants",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Conversation and DeletedConversation
  db.Conversation.hasMany(db.DeletedConversation, {
    foreignKey: "conversationId",
    as: "deletedConversations",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Conversation and Message
  db.Conversation.hasMany(db.Message, {
    foreignKey: "conversationId",
    as: "messages",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Conversation and ConversationReport
  db.Conversation.hasMany(db.ConversationReport, {
    foreignKey: "conversationId",
    as: "conversationReports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-one relationship between Conversation and Media
  db.Conversation.belongsTo(db.Media, {
    foreignKey: "conversationPictureId",
    as: "conversationPicture",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });

  // many to one relationship between Conversation and User (createdBy)
  db.Conversation.belongsTo(db.User, {
    foreignKey: "createdBy",
    as: "user",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
};

export default conversationAssociation;
