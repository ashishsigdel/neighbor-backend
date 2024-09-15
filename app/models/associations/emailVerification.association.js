//emailVerification associations
const emailVerificationAssociation = (db) => {
  // one-to-many relationship between User and EmailVerification
  db.EmailVerification.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default emailVerificationAssociation;
