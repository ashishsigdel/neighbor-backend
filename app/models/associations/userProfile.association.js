//userProfile associations
const userProfileAssociation = (db) => {
  // one-to-one relationship between User and UserProfile
  db.UserProfile.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-one relationship between UserProfile and Media
  db.UserProfile.belongsTo(db.Media, {
    foreignKey: "profilePictureId",
    as: "profilePicture",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // one-to-one relationship between Media and UserProfiles (coverPicture)
  db.UserProfile.belongsTo(db.Media, {
    foreignKey: "coverPictureId",
    as: "coverPicture",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
};

export default userProfileAssociation;
