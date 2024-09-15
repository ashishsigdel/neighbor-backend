/**
 * @typedef RefreshToken
 * @property {number} id - RefreshToken id
 * @property {string} token - RefreshToken token
 * @property {number} userId - RefreshToken userId
 * @property {date} expiresAt - RefreshToken expiresAt
 * @property {date} revokedAt - RefreshToken revokedAt
 * @property {date} createdAt - RefreshToken creation date
 * @property {date} updatedAt - RefreshToken update date
 * @property {date} deletedAt - RefreshToken deletion date
 */

/**
 * @description RefreshToken model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} RefreshToken model
 * @exports RefreshToken
 */

const RefreshToken = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "RefreshToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revokedAt: {
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

export default RefreshToken;
