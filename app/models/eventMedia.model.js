/**
 * @typedef EventMedia
 * @property {number} id - EventMedia id
 * @property {number} eventId - Event id
 * @property {number} mediaId - Media id
 * @property {boolean} isFeatured - Is this media featured
 * @property {date} createdAt - EventMedia creation date
 * @property {date} updatedAt - EventMedia update date
 * @property {date} deletedAt - EventMedia deletion date
 */

/**
 * @description EventMedia model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} EventMedia model
 * @exports EventMedia
 */
const EventMedia = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "EventMedia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      eventId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the event",
      },

      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the media",
      },

      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "Is this media featured",
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: "event_medias",
    }
  );
};

export default EventMedia;
