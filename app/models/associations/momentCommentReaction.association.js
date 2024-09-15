const momentCommentReactionAssociation = (db) => {
  // many to one relationship between MomentCommentReaction and User
  db.MomentCommentReaction.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between MomentCommentReaction and MomentComment
  db.MomentCommentReaction.belongsTo(db.MomentComment, {
    foreignKey: "momentCommentId",
    as: "momentComment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default momentCommentReactionAssociation;
