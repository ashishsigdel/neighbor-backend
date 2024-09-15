const messageReadStatusAssociation = (db) => {
  // many to one relationship between MessageReadStatus and Message
  db.MessageReadStatus.belongsTo(db.Message, {
    foreignKey: "messageId",
    as: "message",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between MessageReadStatus and User
  db.MessageReadStatus.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default messageReadStatusAssociation;
