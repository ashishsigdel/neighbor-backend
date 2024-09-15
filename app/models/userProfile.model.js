import Gender from "../enums/gender.js";

/**
 * @description User profile model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} User profile model
 * @exports UserProfile
 */

/**
 * @typedef {Object} UserProfile
 * @property {number} id - User profile id
 * @property {number} userId - User id
 * @property {string} fullName - User full name
 * @property {string} phone - User phone number
 * @property {enum} gender - Gender of user
 * @property {date} dob - User date of birth
 * @property {string} bio - User bio
 * @property {string} profilePicture - User profile picture
 * @property {date} createdAt - User profile creation date
 * @property {date} updatedAt - User profile update date
 * @property {date} deletedAt - User profile deletion date
 */

const UserProfile = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "UserProfile",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
      },
      fullName: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING(20),
      },
      gender: {
        type: DataTypes.ENUM(Object.values(Gender)),
        allowNull: true,
      },
      dob: {
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
      bio: {
        allowNull: true,
        type: DataTypes.STRING(500),
      },
      profilePictureId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      coverPictureId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default UserProfile;
