/**
 * @typedef Location
 * @property {number} id - Location id
 * @property {number} latitude - Location latitude
 * @property {number} longitude - Location longitude
 * @property {date} createdAt - Location creation date
 * @property {date} updatedAt - Location update date
 * @property {date} deletedAt - Location deletion date
 */

const Location = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Location",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      latitude: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "latitude",
      },
      longitude: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "longitude",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who created the location",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default Location;
