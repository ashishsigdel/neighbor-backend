const jobAssociation = (db) => {
  // many to one relationship between Job and User
  db.Job.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Job and JobCategory
  db.Job.belongsTo(db.JobCategory, {
    foreignKey: "jobCategoryId",
    as: "jobCategory",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relationship between Job and Company
  db.Job.belongsTo(db.Company, {
    foreignKey: "companyId",
    as: "company",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to many relationship between Job and User for job viewers
  db.Job.belongsToMany(db.User, {
    through: "job_viewers",
    foreignKey: "jobId",
    otherKey: "userId",
    as: "views",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default jobAssociation;
