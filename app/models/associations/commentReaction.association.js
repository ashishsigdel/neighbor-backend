//commentReaction associations
const commentReactionAssociation = (db) => {
  // one-to-many relationship between User and CommentReaction
  db.CommentReaction.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Comment and CommentReaction
  db.CommentReaction.belongsTo(db.Comment, {
    foreignKey: "commentId",
    as: "comment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default commentReactionAssociation;
