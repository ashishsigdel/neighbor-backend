/**
 * @typedef {object} MomentMedia
 * @property {number} id - MomentMedia id
 * @property {number} momentId - Moment id
 * @property {number} mediaId - Media id
 * @property {date} createdAt - MomentMedia creation date
 * @property {date} updatedAt - MomentMedia update date
 * @property {date} deletedAt - MomentMedia deletion date
 */

/**
 * @description MomentMedia model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} MomentMedia model
 * @exports MomentMedia
 */

const MomentMedia = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "MomentMedia",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      momentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Moment id",
      },
      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Media id",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: "moment_medias",
    }
  );
};

export default MomentMedia;
