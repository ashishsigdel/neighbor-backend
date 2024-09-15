/**
 * @typedef Hashtag
 * @property {number} id - Hashtag id
 * @property {string} hashtag - Hashtag hashtag
 * @property {date} createdAt - Hashtag creation date
 * @property {date} updatedAt - Hashtag update date
 * @property {date} deletedAt - Hashtag deletion date
 */

/**
 * @description Hashtag model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Hashtag model
 * @exports Hashtag
 */
const Hashtag = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Hashtag",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      hashtag: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: "hashtag",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default Hashtag;
