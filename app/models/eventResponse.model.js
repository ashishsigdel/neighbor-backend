import EventResponseType from "../enums/eventResponseType.js";

/**
 * @typedef {object} EventResponseModel
 * @property {number} id - EventResponse id
 * @property {number} userId - User id
 * @property {number} eventId - Event id
 * @property {string} type - Type of the response
 * @property {date} createdAt - EventResponse creation date
 * @property {date} updatedAt - EventResponse update date
 * @property {date} deletedAt - EventResponse deletion date
 */

/**
 * @description Event response model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} EventResponse model
 * @exports EventResponse
 */

const EventResponse = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "EventResponse",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who responded to the event",
      },

      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the event",
      },

      type: {
        type: DataTypes.ENUM(Object.values(EventResponseType)),
        allowNull: false,
        comment: "Type of the response",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default EventResponse;
