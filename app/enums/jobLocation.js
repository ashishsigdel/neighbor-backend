/**
 * @description Enum for job location
 * @enum {string}
 * @readonly
 * @example
 * import JobLocation from "./app/enums/jobLocation.js";
 * JobLocation.REMOTE // for remote
 * JobLocation.ONSITE // for onsite
 * ...
 * @module JobLocation
 * @exports JobLocation
 */
const JobLocation = {
  REMOTE: "remote",
  ONSITE: "onsite",
  HYBRID: "hybrid",
};

export default JobLocation;
