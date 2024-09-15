const NotificationAssociation = (db) => {
  // many to one relationship between Notification and User
  db.Notification.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Notification and User (sender)
  db.Notification.belongsTo(db.User, {
    foreignKey: "senderId",
    as: "sender",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default NotificationAssociation;
