/**
 * @typedef {object} PasswordReset
 * @property {number} id - PasswordReset id
 * @property {number} userId - PasswordReset userId
 * @property {string} otp - PasswordReset otp
 * @property {number} attempts - PasswordReset attempts
 * @property {date} expiresAt - PasswordReset expiresAt
 * @property {date} verifiedAt - PasswordReset verifiedAt
 * @property {date} createdAt - PasswordReset creation date
 * @property {date} updatedAt - PasswordReset update date
 * @property {date} deletedAt - PasswordReset deletion date
 */

/**
 * @description PasswordReset model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} PasswordReset model
 * @exports PasswordReset
 */

const PasswordReset = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "PasswordReset",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      resetToken: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      otp: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      passwordChangedAt: {
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

export default PasswordReset;
