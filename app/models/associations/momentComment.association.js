const momentCommentAssociation = (db) => {
  // many to one relationship between MomentComment and User
  db.MomentComment.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between MomentComment and Moment
  db.MomentComment.belongsTo(db.Moment, {
    foreignKey: "momentId",
    as: "moment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between MomentComment and MomentComment
  db.MomentComment.hasMany(db.MomentComment, {
    foreignKey: "parentCommentId",
    as: "comments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to one relationship between MomentComment and MomentComment
  db.MomentComment.belongsTo(db.MomentComment, {
    foreignKey: "parentCommentId",
    as: "parentComment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between MomentComment and MomentCommentReaction
  db.MomentComment.hasMany(db.MomentCommentReaction, {
    foreignKey: "momentCommentId",
    as: "reactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between MomentComment and Media
  db.MomentComment.belongsToMany(db.Media, {
    through: db.MomentCommentMedia,
    foreignKey: "momentCommentId",
    otherKey: "mediaId",
    as: "medias",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many to many relationship between MomentComment and Hashtag
  db.MomentComment.belongsToMany(db.Hashtag, {
    through: "moment_comment_hashtags",
    foreignKey: "momentCommentId",
    otherKey: "hashtagId",
    as: "hashtags",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between MomentComment and Mention
  db.MomentComment.belongsToMany(db.Mention, {
    through: "moment_comment_mentions",
    foreignKey: "momentCommentId",
    otherKey: "mentionId",
    as: "mentions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default momentCommentAssociation;
