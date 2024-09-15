const eventAssociation = (db) => {
  // many to one relationship between Event and User
  db.Event.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to one relationship between Event and Location
  db.Event.belongsTo(db.Location, {
    foreignKey: "locationId",
    as: "location",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between Event and Media through EventMedia model
  db.Event.belongsToMany(db.Media, {
    through: db.EventMedia,
    foreignKey: "eventId",
    otherKey: "mediaId",
    as: "medias",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many to many relation between Event and User for event bookmark
  db.Event.belongsToMany(db.User, {
    through: "event_bookmarks",
    foreignKey: "eventId",
    otherKey: "userId",
    as: "bookmarks",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Event and User for event response through EventResponse model
  db.Event.belongsToMany(db.User, {
    through: db.EventResponse,
    foreignKey: "eventId",
    otherKey: "userId",
    as: "responses",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Event and User for event views
  db.Event.belongsToMany(db.User, {
    through: "event_viewers",
    foreignKey: "eventId",
    otherKey: "userId",
    as: "views",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default eventAssociation;
