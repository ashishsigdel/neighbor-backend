//location associations
export default (db) => {
  // one-to-one relationship between Post and Location
  db.Location.hasOne(db.Post, {
    foreignKey: "locationId",
    as: "post",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between User and Location
  db.Location.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to one relationship between Location and Moment
  db.Location.hasOne(db.Moment, {
    foreignKey: "locationId",
    as: "moment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to one relationship between Location and Event
  db.Location.hasOne(db.Event, {
    foreignKey: "locationId",
    as: "event",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to one relationship between Location and Company
  db.Location.hasOne(db.Company, {
    foreignKey: "locationId",
    as: "company",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // one to one relationship between Location and Rental
  db.Location.hasOne(db.Rental, {
    foreignKey: "locationId",
    as: "rental",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
};
