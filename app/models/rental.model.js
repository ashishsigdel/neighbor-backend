import PricePaymentDurationType from "../enums/pricePaymentDurationType.js";

/**
 * @typedef Rental
 * @property {number} id - Rental id
 * @property {string} title - Rental title
 * @property {string} description - Rental description
 * @property {string} address - Rental address
 * @property {number} locationId - Rental locationId
 * @property {string} price - Rental price
 * @property {string} pricePaymentDurationType - Rental pricePaymentDurationType
 * @property {number} userId - Rental userId
 * @property {date} createdAt - Rental creation date
 * @property {date} updatedAt - Rental update date
 * @property {date} deletedAt - Rental deletion date
 */

/**
 * @description Rental model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Rental model
 * @exports Rental
 */

const Rental = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Rental",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "Rental title",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Rental description",
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Rental address",
      },

      price: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Rental price",
      },
      pricePaymentDurationType: {
        type: DataTypes.ENUM,
        values: Object.values(PricePaymentDurationType),
        allowNull: false,
        comment: "Rental price payment duration type",
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the rental location",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "User id",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default Rental;
