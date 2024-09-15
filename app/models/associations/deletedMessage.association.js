const deletedMessageAssociation = (db) => {
  // many to one relationship between DeletedMessage and Message
  db.DeletedMessage.belongsTo(db.Message, {
    foreignKey: "messageId",
    as: "message",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between DeletedMessage and User
  db.DeletedMessage.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default deletedMessageAssociation;
