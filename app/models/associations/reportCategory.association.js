const reportCategoryAssociation = (db) => {
  // one to many relationship between ReportCategory and ReportCategory
  db.ReportCategory.hasMany(db.ReportCategory, {
    foreignKey: "parentCategoryId",
    as: "subCategories",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between ReportCategory and ReportCategory
  db.ReportCategory.belongsTo(db.ReportCategory, {
    foreignKey: "parentCategoryId",
    as: "parentCategory",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between ReportCategory and UserReport
  db.ReportCategory.hasMany(db.UserReport, {
    foreignKey: "categoryId",
    as: "userReports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between ReportCategory and PostReport
  db.ReportCategory.hasMany(db.PostReport, {
    foreignKey: "categoryId",
    as: "postReports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // one to many relationship between ReportCategory and MomentReport
  db.ReportCategory.hasMany(db.MomentReport, {
    foreignKey: "categoryId",
    as: "momentReports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default reportCategoryAssociation;
