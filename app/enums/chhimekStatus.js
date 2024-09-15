/**
 * @description Chhimek status enum
 * @enum {string}
 * @readonly
 * @example
 * import ChhimekStatus from "./app/enums/chhimekStatus.js";
 * ChhimekStatus.PENDING // for pending
 * ChhimekStatus.ACCEPTED // for accepted
 * ChhimekStatus.BLOCKED // for blocked
 * ...
 * @module chhimekStatus
 * @exports ChhimekStatus
 */

const ChhimekStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  BLOCKED: "blocked",
};

export default ChhimekStatus;
