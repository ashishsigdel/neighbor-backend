//post associations
const postAssociation = (db) => {
  // one-to-many relationship between User and Post
  db.Post.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-many relationship between Post and Post
  db.Post.hasMany(db.Post, {
    foreignKey: "originalPostId",
    as: "posts",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-one relationship between Post and Post
  db.Post.belongsTo(db.Post, {
    foreignKey: "originalPostId",
    as: "originalPost",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Post and Media
  db.Post.belongsToMany(db.Media, {
    through: db.PostMedia,
    foreignKey: "postId",
    otherKey: "mediaId",
    as: "medias",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // one-to-many relationship between Post and Comment
  db.Post.hasMany(db.Comment, {
    foreignKey: "postId",
    as: "comments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Post and Hashtag
  db.Post.belongsToMany(db.Hashtag, {
    through: "post_hashtags",
    foreignKey: "postId",
    otherKey: "hashtagId",
    as: "hashtags",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Post and Mention
  db.Post.belongsToMany(db.Mention, {
    through: "post_mentions",
    foreignKey: "postId",
    otherKey: "mentionId",
    as: "mentions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to one relation between Post and Location
  db.Post.belongsTo(db.Location, {
    foreignKey: "locationId",
    as: "location",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between Post and PostReaction
  db.Post.hasMany(db.PostReaction, {
    foreignKey: "postId",
    as: "reactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //many to many relation between Post and HiddenPost
  db.Post.belongsToMany(db.User, {
    through: "hidden_posts",
    foreignKey: "postId",
    otherKey: "userId",
    as: "hiddenBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between Post and PostReport
  db.Post.hasMany(db.PostReport, {
    foreignKey: "postId",
    as: "reports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between Post and User (post viewers)
  db.Post.belongsToMany(db.User, {
    through: "post_viewers",
    foreignKey: "postId",
    otherKey: "userId",
    as: "viewers",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default postAssociation;
