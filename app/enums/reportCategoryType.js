/**
 * @typedef {Object} ReportCategoryType
 * @description Report category type enum
 * @property {string} POST - Post report category
 * @property {string} USER - User report category
 * @property {string} COMMENT - Comment report category
 * @property {string} CHHIMEK - Chhimek report category
 * ...
 * @example
 * import ReportCategoryType from "./app/enums/reportCategoryType.js";
 * ReportCategoryType.POST // for post report category
 * ReportCategoryType.USER // for user report category
 * ...
 */
const ReportCategoryType = {
  POST: "post",
  USER: "user",
  COMMENT: "comment",
  CHHIMEK: "chhimek",
};

export default ReportCategoryType;
