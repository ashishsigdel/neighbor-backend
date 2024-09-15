//comment associations
const commentAssociation = (db) => {
  // one-to-many relationship between User and Comment
  db.Comment.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-many relationship between Post and Comment
  db.Comment.belongsTo(db.Post, {
    foreignKey: "postId",
    as: "post",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-many relationship between Comment and Comment
  db.Comment.hasMany(db.Comment, {
    foreignKey: "parentCommentId",
    as: "comments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-one relationship between Comment and Comment
  db.Comment.belongsTo(db.Comment, {
    foreignKey: "parentCommentId",
    as: "parentComment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Comment and CommentReaction
  db.Comment.hasMany(db.CommentReaction, {
    foreignKey: "commentId",
    as: "commentReactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Comment and Media
  db.Comment.belongsToMany(db.Media, {
    through: db.CommentMedia,
    foreignKey: "commentId",
    otherKey: "mediaId",
    as: "medias",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Comment and Hashtag
  db.Comment.belongsToMany(db.Hashtag, {
    through: "comment_hashtags",
    foreignKey: "commentId",
    otherKey: "hashtagId",
    as: "hashtags",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Comment and Mention
  db.Comment.belongsToMany(db.Mention, {
    through: "comment_mentions",
    foreignKey: "commentId",
    otherKey: "mentionId",
    as: "mentions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default commentAssociation;
