const pinnedMessageAssociation = (db) => {
  // many to one relationship between Pinned Message and Message
  db.PinnedMessage.belongsTo(db.Message, {
    foreignKey: "messageId",
    as: "message",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Pinned Message and User
  db.PinnedMessage.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default pinnedMessageAssociation;
