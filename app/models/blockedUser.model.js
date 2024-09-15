/**
 * @typedef BlockedUser
 * @property {number} id - BlockedUser id
 * @property {number} userId - userId (ID of the user who blocked)
 * @property {number} blockedUserId - blockedUserId (ID of the user who got blocked)
 * @property {date} createdAt - BlockedUser creation date
 * @property {date} updatedAt - BlockedUser update date
 * @property {date} deletedAt - BlockedUser deletion date
 */

/**
 * @description BlockedUser model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} BlockedUser model
 * @exports BlockedUser
 */
const BlockedUser = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "BlockedUser",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who blocked",
      },

      blockedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who got blocked",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default BlockedUser;
