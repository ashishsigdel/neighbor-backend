//loginHistory associations
const loginHistoryAssociation = (db) => {
  // one-to-many relationship between User and LoginHistory
  db.LoginHistory.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default loginHistoryAssociation;
