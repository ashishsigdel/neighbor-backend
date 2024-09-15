/**
 * @description Enum for event response types
 * @enum {string}
 * @readonly
 * @example
 * import EventResponseType from "./app/enums/eventResponseType.js";
 * EventResponseType.GOING // for going
 * EventResponseType.INTERESTED // for interested
 * EventResponseType.NOT_GOING // for not going
 * EventResponseType.NOT_INTERESTED // for not interested
 * @module EventResponseType
 * @exports EventResponseType
 */

const EventResponseType = {
  GOING: "going",
  INTERESTED: "interested",
  NOT_GOING: "not_going",
  NOT_INTERESTED: "not_interested",
};

export default EventResponseType;
