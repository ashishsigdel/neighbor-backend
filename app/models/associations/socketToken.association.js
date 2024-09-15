const socketTokenAssociation = (db) => {
  // many to one relationship between socket token and user
  db.SocketToken.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default socketTokenAssociation;
