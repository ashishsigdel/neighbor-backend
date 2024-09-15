const momentReactionAssociation = (db) => {
  // many-to-one relationship between Moment and User
  db.MomentReaction.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Moment and MomentReaction
  db.MomentReaction.belongsTo(db.Moment, {
    foreignKey: "momentId",
    as: "moment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default momentReactionAssociation;
