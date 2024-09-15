import ReportStatus from "../enums/reportStatus.js";

/**
 * @typedef MomentReport
 * @property {number} id - MomentReport id
 * @property {number} categoryId - MomentReport reportCategoryId
 * @property {number} momentId - MomentReport momentId
 * @property {number} userId - MomentReport userId
 * @property {string} description - MomentReport description
 * @property {string} status - MomentReport status
 * @property {number} handledBy - MomentReport handledBy
 * @property {date} handledAt - MomentReport handledAt
 * @property {string} response - MomentReport response
 * @property {date} createdAt - MomentReport creation date
 * @property {date} updatedAt - MomentReport update date
 * @property {date} deletedAt - MomentReport deletion date
 */

/**
 * @description MomentReport model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} MomentReport model
 * @exports MomentReport
 */

const MomentReport = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "MomentReport",
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
      momentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the moment where the report was made",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who reported",
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

export default MomentReport;
