//mention associations
const mentionAssociation = (db) => {
  db.Mention.belongsTo(db.User, {
    foreignKey: "mentionedToUser",
    as: "mentionedTo",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.Mention.belongsTo(db.User, {
    foreignKey: "mentionedByUser",
    as: "mentionedBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Mention and Post
  db.Mention.belongsToMany(db.Post, {
    through: "post_mentions",
    foreignKey: "mentionId",
    otherKey: "postId",
    as: "posts",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Mention and Comment
  db.Mention.belongsToMany(db.Comment, {
    through: "comment_mentions",
    foreignKey: "mentionId",
    otherKey: "commentId",
    as: "comments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Mention and Moment
  db.Mention.belongsToMany(db.Moment, {
    through: "moment_mentions",
    foreignKey: "mentionId",
    otherKey: "momentId",
    as: "moments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Mention and MomentComment
  db.Mention.belongsToMany(db.MomentComment, {
    through: "moment_comment_mentions",
    foreignKey: "mentionId",
    otherKey: "momentCommentId",
    as: "momentComments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default mentionAssociation;
