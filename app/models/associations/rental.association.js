const rentalAssociation = (db) => {
  // many to one relation between rental and user
  db.Rental.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between rental and user for rental viewers
  db.Rental.belongsToMany(db.User, {
    through: "rental_viewers",
    foreignKey: "rentalId",
    otherKey: "userId",
    as: "views",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relation between rental and media
  db.Rental.belongsToMany(db.Media, {
    through: db.RentalMedia,
    foreignKey: "rentalId",
    otherKey: "mediaId",
    as: "medias",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // one to one relation between rental and location
  db.Rental.belongsTo(db.Location, {
    foreignKey: "locationId",
    as: "location",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
};

export default rentalAssociation;
