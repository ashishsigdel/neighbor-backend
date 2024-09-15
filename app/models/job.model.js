import JobType from "../enums/jobType.js";
import JobLevel from "../enums/jobLevel.js";
import JobLocation from "../enums/jobLocation.js";

/**
 * @typedef {Object} Job
 * @property {number} id - Job id
 * @property {string} title - Job title
 * @property {string} description - Job description
 * @property {string} requirements - Job requirements
 * @property {string} benefits - Job benefits
 * @property {string} type - Job type
 * @property {string} level - Job level
 * @property {string} location - Job location
 * @property {number} userId - Job userId
 * @property {number} jobCategoryId - Job jobCategoryId
 * @property {number} companyId - Job companyId
 * @property {date} deadline - Job deadline
 * @property {date} createdAt - Job creation date
 * @property {date} updatedAt - Job update date
 * @property {date} deletedAt - Job deletion date
 */

/**
 * @description Job model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Job model
 * @exports Job
 */

const Job = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Job",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "Title of the job",
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Description of the job",
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Requirements of the job",
      },
      benefits: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Benefits of the job",
      },

      type: {
        type: DataTypes.ENUM(Object.values(JobType)),
        allowNull: false,
        comment: "Type of the job",
      },
      level: {
        type: DataTypes.ENUM(Object.values(JobLevel)),
        allowNull: false,
        comment: "Level of the job",
      },
      location: {
        type: DataTypes.ENUM(Object.values(JobLocation)),
        allowNull: false,
        comment: "Location of the job",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who posted the job",
      },
      jobCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the job category",
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the company",
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "Deadline of the job",
      },
      applyLink: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Apply link of the job",
      },
    },
    {
      underscored: true,
      paranoid: true,
      timestamps: true,
    }
  );
};

export default Job;
