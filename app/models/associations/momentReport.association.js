const MomentReportAssociation = (db) => {
  // many to one relation between MomentReport and User
  db.MomentReport.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relation between MomentReport and User (handledBy)
  db.MomentReport.belongsTo(db.User, {
    foreignKey: "handledBy",
    as: "handledByUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default MomentReportAssociation;
