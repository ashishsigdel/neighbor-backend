//hashtag associations
const hashtagAssociation = (db) => {
  // many-to-many relationship between Post and Hashtag
  db.Hashtag.belongsToMany(db.Post, {
    through: "post_hashtags",
    foreignKey: "hashtagId",
    otherKey: "postId",
    as: "posts",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Comment and Hashtag
  db.Hashtag.belongsToMany(db.Comment, {
    through: "comment_hashtags",
    foreignKey: "hashtagId",
    otherKey: "commentId",
    as: "comments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Moment and Hashtag
  db.Hashtag.belongsToMany(db.Moment, {
    through: "moment_hashtags",
    foreignKey: "hashtagId",
    otherKey: "momentId",
    as: "moments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between MomentComment and Hashtag
  db.Hashtag.belongsToMany(db.MomentComment, {
    through: "moment_comment_hashtags",
    foreignKey: "hashtagId",
    otherKey: "momentCommentId",
    as: "momentComments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default hashtagAssociation;
