//fcmToken associations
const fcmTokenAssociation = (db) => {
  // one-to-many relationship between User and FcmToken
  db.FcmToken.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default fcmTokenAssociation;
