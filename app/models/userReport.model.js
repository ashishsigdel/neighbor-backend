import ReportStatus from "../enums/reportStatus.js";

/**
 * @typedef UserReport
 * @property {number} id - UserReport id
 * @property {number} categoryId - UserReport reportCategoryId
 * @property {number} userId - UserReport userId
 * @property {number} reportedUserId - UserReport reportedUserId
 * @property {string} description - UserReport description
 * @property {string} status - UserReport status
 * @property {number} handledBy - UserReport handledBy
 * @property {date} handledAt - UserReport handledAt
 * @property {string} response - UserReport response
 * @property {date} createdAt - UserReport creation date
 * @property {date} updatedAt - UserReport update date
 * @property {date} deletedAt - UserReport deletion date
 */

/**
 * @description UserReport model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} UserReport model
 * @exports UserReport
 */

const UserReport = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "UserReport",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the report category",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who reported",
      },
      reportedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who was reported",
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Description of the report",
      },
      status: {
        type: DataTypes.ENUM(Object.values(ReportStatus)),
        allowNull: false,
        defaultValue: ReportStatus.PENDING,
        comment: "Status of the report",
      },
      handledBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the user who handled the report",
      },
      handledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Date when the report was handled",
      },
      response: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Response to the report",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default UserReport;
