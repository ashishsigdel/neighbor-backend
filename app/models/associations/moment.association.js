const momentAssociation = (db) => {
  // many-to-one relationship between Moment and User
  db.Moment.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Moment and Media
  db.Moment.belongsToMany(db.Media, {
    through: db.MomentMedia,
    foreignKey: "momentId",
    otherKey: "mediaId",
    as: "medias",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Moment and MomentComment
  db.Moment.hasMany(db.MomentComment, {
    foreignKey: "momentId",
    as: "comments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Moment and Hashtag
  db.Moment.belongsToMany(db.Hashtag, {
    through: "moment_hashtags",
    foreignKey: "momentId",
    otherKey: "hashtagId",
    as: "hashtags",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Moment and Mention
  db.Moment.belongsToMany(db.Mention, {
    through: "moment_mentions",
    foreignKey: "momentId",
    otherKey: "mentionId",
    as: "mentions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to one relationship between Moment and Location
  db.Moment.belongsTo(db.Location, {
    foreignKey: "locationId",
    as: "location",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Moment and MomentReaction
  db.Moment.hasMany(db.MomentReaction, {
    foreignKey: "momentId",
    as: "reactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Moment and HiddenMoment
  db.Moment.belongsToMany(db.User, {
    through: "hidden_moments",
    foreignKey: "momentId",
    otherKey: "userId",
    as: "hiddenBy",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between Moment and MomentReport
  db.Moment.hasMany(db.MomentReport, {
    foreignKey: "momentId",
    as: "reports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Moment and User (Moment viewwers)
  db.Moment.belongsToMany(db.User, {
    through: "moment_viewers",
    foreignKey: "momentId",
    otherKey: "userId",
    as: "viewers",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default momentAssociation;
