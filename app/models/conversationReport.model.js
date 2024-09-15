import ReportStatus from "../enums/reportStatus.js";

/**
 * @typedef ConversationReport
 * @property {number} id - ConversationReport id
 * @property {number} categoryId - ConversationReport reportCategoryId
 * @property {number} conversationId - ConversationReport conversationId
 * @property {number} userId - ConversationReport userId
 * @property {string} description - ConversationReport description
 * @property {string} status - ConversationReport status
 * @property {number} handledBy - ConversationReport handledBy
 * @property {date} handledAt - ConversationReport handledAt
 * @property {string} response - ConversationReport response
 * @property {date} createdAt - ConversationReport creation date
 * @property {date} updatedAt - ConversationReport update date
 * @property {date} deletedAt - ConversationReport deletion date
 */

/**
 * @description ConversationReport model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} ConversationReport model
 * @exports ConversationReport
 */

const ConversationReport = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "ConversationReport",
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
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the conversation where the report was made",
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

export default ConversationReport;
