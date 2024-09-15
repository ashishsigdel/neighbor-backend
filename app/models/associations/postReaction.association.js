//postReaction associations
const postReactionAssociation = (db) => {
  // many-to-many relationship between Post and User
  db.PostReaction.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Post and PostReaction
  db.PostReaction.belongsTo(db.Post, {
    foreignKey: "postId",
    as: "post",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default postReactionAssociation;
