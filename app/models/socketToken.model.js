const SocketToken = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "SocketToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        allowNull: false,
        type: DataTypes.STRING(100),
        unique: true,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};

export default SocketToken;
