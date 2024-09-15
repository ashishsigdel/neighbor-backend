import ReportStatus from "../enums/reportStatus.js";

/**
 * @typedef PostReport
 * @property {number} id - PostReport id
 * @property {number} reportCategoryId - PostReport reportCategoryId
 * @property {number} postId - PostReport postId
 * @property {number} userId - PostReport userId
 * @property {string} description - PostReport description
 * @property {string} status - PostReport status
 * @property {number} handledBy - PostReport handledBy
 * @property {date} handledAt - PostReport handledAt
 * @property {string} response - PostReport response
 * @property {date} createdAt - PostReport creation date
 * @property {date} updatedAt - PostReport update date
 * @property {date} deletedAt - PostReport deletion date
 */

/**
 * @description PostReport model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} PostReport model
 * @exports PostReport
 */

const PostReport = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "PostReport",
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
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the post where the report was made",
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

export default PostReport;
