const postReportAssociation = (db) => {
  // many to one relation between PostReport and User
  db.PostReport.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relation between PostReport and User (handledBy)
  db.PostReport.belongsTo(db.User, {
    foreignKey: "handledBy",
    as: "handledByUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default postReportAssociation;
