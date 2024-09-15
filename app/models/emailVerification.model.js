/**
 * @typedef {object} EmailVerification
 * @property {number} id - EmailVerification id
 * @property {number} userId - EmailVerification userId
 * @property {string} otp - EmailVerification otp
 * @property {number} attempts - EmailVerification attempts
 * @property {date} expiresAt - EmailVerification expiresAt
 * @property {date} verifiedAt - EmailVerification verifiedAt
 * @property {date} createdAt - EmailVerification creation date
 * @property {date} updatedAt - EmailVerification update date
 * @property {date} deletedAt - EmailVerification deletion date
 */

/**
 * @description EmailVerification model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} EmailVerification model
 * @exports EmailVerification
 */

const EmailVerification = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "EmailVerification",
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
      otp: {
        type: DataTypes.STRING,
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
      },
      verifiedAt: {
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

export default EmailVerification;
