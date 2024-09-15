/**
 * @typedef {Object} ReportStatus
 * @description Report status enum
 * @property {string} PENDING - Pending report
 * ...
 * @example
 * import ReportStatus from "./app/enums/reportStatus.js";
 * ReportStatus.PENDING // for pending report
 * ...
 */

const ReportStatus = {
  PENDING: "pending",
  IN_REVIEW: "in_review",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export default ReportStatus;
