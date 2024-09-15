const conversationReportAssociation = (db) => {
  // many to one relation between ConversationReport and User
  db.ConversationReport.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // many to one relation between ConversationReport and User (handledBy)
  db.ConversationReport.belongsTo(db.User, {
    foreignKey: "handledBy",
    as: "handledByUser",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

export default conversationReportAssociation;
