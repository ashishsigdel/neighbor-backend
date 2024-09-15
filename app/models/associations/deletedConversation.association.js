const deletedConversationAssociation = (db) => {
  // many to one relationship between DeletedConversation and Conversation
  db.DeletedConversation.belongsTo(db.Conversation, {
    foreignKey: "conversationId",
    as: "conversation",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between DeletedConversation and User
  db.DeletedConversation.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default deletedConversationAssociation;
