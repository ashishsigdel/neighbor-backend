//MessageReaction associations
const messageReactionAssociation = (db) => {
  // one-to-many relationship between User and MessageReaction
  db.MessageReaction.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Message and MessageReaction
  db.MessageReaction.belongsTo(db.Message, {
    foreignKey: "messageId",
    as: "message",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default messageReactionAssociation;
