const conversationParticipantAssociation = (db) => {
  // many to one relationship between ConversationParticipant and Conversation
  db.ConversationParticipant.belongsTo(db.Conversation, {
    foreignKey: "conversationId",
    as: "conversation",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between ConversationParticipant and User
  db.ConversationParticipant.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between ConversationParticipant and User (eventPerformedBy)
  db.ConversationParticipant.belongsTo(db.User, {
    foreignKey: "eventPerformedBy",
    as: "eventPerformedByUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default conversationParticipantAssociation;
