//passwordReset associations
const passwordResetAssociation = (db) => {
  // one-to-many relationship between User and PasswordReset
  db.PasswordReset.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default passwordResetAssociation;
