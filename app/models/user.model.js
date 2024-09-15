/**
 * @typedef {object} User
 * @property {number} id - User id
 * @property {string} username - User username
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {boolean} isEmailVerified - User isEmailVerified status
 * @property {boolean} isEnabled - User isEnabled status
 * @property {boolean} isAccountLocked - User isAccountLocked status
 * @property {boolean} isCredentialsExpired - User isCredentialsExpired status
 * @property {date} createdAt - User creation date
 * @property {date} updatedAt - User update date
 * @property {date} deletedAt - User deletion date
 */

/**
 * @description User model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} User model
 * @exports User
 */

const User = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING(30),
        unique: true,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(100),
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(150),
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isAccountLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isCredentialsExpired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      lastLoggedInAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      lastOnlineAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default User;
