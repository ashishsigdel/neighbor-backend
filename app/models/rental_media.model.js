/**
 * @typedef {object} RentalMedia
 * @property {number} id - RentalMedia id
 * @property {number} postId - Rental id
 * @property {number} mediaId - Media id
 * @property {date} createdAt - RentalMedia creation date
 * @property {date} updatedAt - RentalMedia update date
 * @property {date} deletedAt - RentalMedia deletion date
 */

/**
 * @description RentalMedia model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} RentalMedia model
 * @exports RentalMedia
 */

const RentalMedia = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "RentalMedia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rentalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Rental id",
      },
      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Media id",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default RentalMedia;
