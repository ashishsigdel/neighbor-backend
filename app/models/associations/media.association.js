//media associations
const mediaAssociation = (db) => {
  // one-to-many relationship between User and Media
  db.Media.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one-to-one relationship between Media and UserProfile
  db.Media.hasOne(db.UserProfile, {
    foreignKey: "profilePictureId",
    as: "userProfile",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // one-to-one relationship between Media and UserProfiles (coverPicture)
  db.Media.hasOne(db.UserProfile, {
    foreignKey: "coverPictureId",
    as: "coverUserProfile",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Media and Post
  db.Media.belongsToMany(db.Post, {
    through: db.PostMedia,
    foreignKey: "mediaId",
    otherKey: "postId",
    as: "posts",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Media and Comment
  db.Media.belongsToMany(db.Comment, {
    through: db.CommentMedia,
    foreignKey: "mediaId",
    otherKey: "commentId",
    as: "comments",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Media and Message
  db.Media.belongsToMany(db.Message, {
    through: db.MessageMedia,
    foreignKey: "mediaId",
    otherKey: "messageId",
    as: "messages",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Media and Moment
  db.Media.belongsToMany(db.Moment, {
    through: db.MomentMedia,
    foreignKey: "mediaId",
    otherKey: "momentId",
    as: "moments",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many-to-many relationship between Media and MomentComment
  db.Media.belongsToMany(db.MomentComment, {
    through: db.MomentCommentMedia,
    foreignKey: "mediaId",
    otherKey: "momentCommentId",
    as: "momentComments",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many to many relation between Media and Event through EventMedia model
  db.Media.belongsToMany(db.Event, {
    through: db.EventMedia,
    foreignKey: "mediaId",
    otherKey: "eventId",
    as: "events",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  //one to one relation between Media and Company
  db.Media.hasOne(db.Company, {
    foreignKey: "logoId",
    as: "companyLogo",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // many to many relation between Media and Rental
  db.Media.belongsToMany(db.Rental, {
    through: db.RentalMedia,
    foreignKey: "mediaId",
    otherKey: "rentalId",
    as: "rentals",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // one-to-one relationship between Media and Conversation
  db.Media.hasOne(db.Conversation, {
    foreignKey: "conversationPictureId",
    as: "conversationPicture",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
};

export default mediaAssociation;
