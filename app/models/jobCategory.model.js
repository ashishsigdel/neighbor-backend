/**
 * @typedef {Object} JobCategoryType
 * @property {number} id - JobCategory id
 * @property {string} title - JobCategory title
 * @property {string} description - JobCategory description
 * @property {date} createdAt - JobCategory creation date
 * @property {date} updatedAt - JobCategory update date
 * @property {date} deletedAt - JobCategory deletion date
 */

/**
 * @description JobCategory model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} JobCategory model
 * @exports JobCategory
 */

const JobCategory = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "JobCategory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(100),
        comment: "Title of the job category",
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(255),
        comment: "Description of the job category",
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );
};

export default JobCategory;
