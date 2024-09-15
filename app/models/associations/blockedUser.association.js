const blockedUserAssociation = (db) => {
  // many to one relationship between BlockedUser and User
  db.BlockedUser.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between BlockedUser and User
  db.BlockedUser.belongsTo(db.User, {
    foreignKey: "blockedUserId",
    as: "blockedUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default blockedUserAssociation;
