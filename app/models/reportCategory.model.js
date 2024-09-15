import ReportCategoryType from "../enums/reportCategoryType.js";

/**
 * @typedef ReportCategory
 * @property {number} id - Report category id
 * @property {string} title - Report category title
 * @property {string} description - Report category description
 * @property {number} parentCategoryId - Parent category id
 * @property {string} type - Report category type
 * @property {date} createdAt - Report category creation date
 * @property {date} updatedAt - Report category update date
 * @property {date} deletedAt - Report category deletion date
 */

/**
 * @description Report category model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Report category model
 * @exports ReportCategory
 */
const ReportCategory = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "ReportCategory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "Report category title",
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: "Report category description",
      },
      parentCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Parent category id",
        defaultValue: null,
      },
      type: {
        type: DataTypes.ENUM,
        values: Object.values(ReportCategoryType),
        allowNull: true,
        comment: "Report category type",
        defaultValue: null,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default ReportCategory;
