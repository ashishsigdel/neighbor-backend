//refreshToken associations
const refreshTokenAssociation = (db) => {
  // one-to-many relationship between User and RefreshToken
  db.RefreshToken.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default refreshTokenAssociation;
