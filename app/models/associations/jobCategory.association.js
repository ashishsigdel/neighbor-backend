const jobCategoryAssociation = (db) => {
  // one to many relationship between JobCategory and Job
  db.JobCategory.hasMany(db.Job, {
    foreignKey: "jobCategoryId",
    as: "jobs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default jobCategoryAssociation;
