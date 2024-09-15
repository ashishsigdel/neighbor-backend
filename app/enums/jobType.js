/**
 * @description Enum for job type
 * @enum {string}
 * @readonly
 * @example
 * import JobType from "./app/enums/jobType.js";
 * JobType.FULL_TIME // for full time
 * JobType.PART_TIME // for part time
 * ...
 * @module JobType
 * @exports JobType
 */

const JobType = {
  FULL_TIME: "full_time",
  PART_TIME: "part_time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
  VOLUNTEER: "volunteer",
  TEMPORARY: "temporary",
};

export default JobType;
