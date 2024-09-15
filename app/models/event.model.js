/**
 * @typedef Event
 * @property {number} id - Event id
 * @property {number} userId - User id
 * @property {string} title - Title of the event
 * @property {string} subtitle - Subtitle of the event
 * @property {string} description - Description of the event
 * @property {number} locationId - Location Id of the event
 * @property {date} date - Date of the event
 * @property {string} venue - Venue of the event
 * @property {date} createdAt - Event creation date
 * @property {date} updatedAt - Event update date
 * @property {date} deletedAt - Event deletion date
 */

/**
 * @description Event model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Event model
 * @exports Event
 */

const Event = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who created the event",
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Title of the event",
      },

      subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Subtitle of the event",
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Description of the event",
      },

      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Location Id of the event",
      },

      date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "Date of the event",
      },

      venue: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Venue of the event",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default Event;
