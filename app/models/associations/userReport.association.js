const userReportAssociation = (db) => {
  // many to one relation between UserReport and User
  db.UserReport.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relation between UserReport and User (reportedUser)
  db.UserReport.belongsTo(db.User, {
    foreignKey: "reportedUserId",
    as: "reportedUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default userReportAssociation;
