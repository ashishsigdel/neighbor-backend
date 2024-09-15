/**
 * @typedef {object} Role
 * @property {number} id - Role id
 * @property {string} title - Role title
 * @property {string} description - Role description
 * @property {date} createdAt - Role creation date
 * @property {date} updatedAt - Role update date
 * @property {date} deletedAt - Role deletion date
 */

/**
 * @description Role model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Role model
 * @exports Role
 */

const Role = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
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

export default Role;
