import ChhimekStatus from "../enums/chhimekStatus.js";

/**
 * @typedef Chhimek
 * @property {number} id - Chhimek id
 * @property {number} fromUserId - fromUserId (ID of the user who sent the chhimek)
 * @property {number} toUserId - toUserId (ID of the user who received the chhimek)
 * @property {string} status - status (Chhimek status)
 * @property {date} createdAt - Chhimek creation date
 * @property {date} updatedAt - Chhimek update date
 * @property {date} deletedAt - Chhimek deletion date
 */

/**
 * @description Chhimek model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Chhimek model
 * @exports Chhimek
 */

const Chhimek = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Chhimek",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who sent the chhimek",
      },
      toUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who received the chhimek",
      },
      status: {
        type: DataTypes.ENUM,
        values: Object.values(ChhimekStatus),
        defaultValue: ChhimekStatus.PENDING,
        comment: "Chhimek status",
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

export default Chhimek;
