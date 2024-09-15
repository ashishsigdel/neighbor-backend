const roleAssociation = (db) => {
  // Many Users to Many Roles
  db.Role.belongsToMany(db.User, {
    through: "user_roles", // The name of the intermediate table
    foreignKey: "roleId", // The foreign key in the "user_roles" table that references roles
    otherKey: "userId", // The foreign key in the "user_roles" table that references users
    as: "users", // An alias for the association
    onDelete: "CASCADE", // If a role is deleted, delete the user role as well
    onUpdate: "CASCADE", // If a role is updated, update the user role as well
  });
};

export default roleAssociation;
