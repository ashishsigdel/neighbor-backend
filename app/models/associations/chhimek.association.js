//chhimek associations
const chhimekAssociation = (db) => {
  // one-to-many relationship between User and Chhimek
  db.Chhimek.belongsTo(db.User, {
    foreignKey: "fromUserId",
    as: "fromUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-many relationship between User and Chhimek
  db.Chhimek.belongsTo(db.User, {
    foreignKey: "toUserId",
    as: "toUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default chhimekAssociation;
