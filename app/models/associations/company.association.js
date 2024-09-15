const companyAssociation = (db) => {
  // one to one relation between Company and Media
  db.Company.belongsTo(db.Media, {
    foreignKey: "logoId",
    as: "logo",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // one to one relation between Company and Location
  db.Company.belongsTo(db.Location, {
    foreignKey: "locationId",
    as: "location",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relation between Company and Job
  db.Company.hasMany(db.Job, {
    foreignKey: "companyId",
    as: "jobs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default companyAssociation;
