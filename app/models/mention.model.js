/**
 * @typedef Mention
 * @property {number} id - Mention id
 * @property {number} mentionedToUser - mentionedToUser (To whom the mention was made)
 * @property {number} mentionedByUser - mentionedByUser (Who made the mention)
 * @property {number} startIndex - startIndex (Index where the mention starts)
 * @property {number} endIndex - endIndex (Index where the mention ends)
 * @property {date} createdAt - Mention creation date
 * @property {date} updatedAt - Mention update date
 * @property {date} deletedAt - Mention deletion date
 */

/**
 * @description Mention model
 * @param {import('sequelize').Sequelize} sequelize - Sequelize object
 * @param {import('sequelize').DataTypes} DataTypes - DataTypes object
 * @returns {import('sequelize').Model} Mention model
 * @exports Mention
 */
const Mention = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Mention",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mentionedToUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who was mentioned",
      },
      mentionedByUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "ID of the user who mentioned",
      },

      //used to highlight the mention in the post/comment
      startIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Index where the mention starts",
      },
      endIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Index where the mention ends",
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export default Mention;
