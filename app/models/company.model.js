const Company = (sequelize, Sequelize, DataTypes) => {
  return sequelize.define(
    "Company",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(100),
        comment: "Name of the company",
      },
      logoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the company logo",
      },
      website: {
        allowNull: true,
        type: DataTypes.STRING(255),
        comment: "Website of the company",
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
        comment: "Description of the company",
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID of the company location",
      },
      address: {
        allowNull: true,
        type: DataTypes.STRING(255),
        comment: "Address of the company",
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING(255),
        comment: "Email of the company",
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING(255),
        comment: "Phone of the company",
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );
};

export default Company;
