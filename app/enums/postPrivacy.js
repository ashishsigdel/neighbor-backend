/**
 * @typedef {Object} PostPrivacy
 * @description Post privacy enum
 * @property {string} PUBLIC - Public post
 * @property {string} ONLY_ME - Only me post
 *  ...
 * @example
 * import PostPrivacy from "./app/enums/postPrivacy.js";
 * PostPrivacy.PUBLIC // for public post
 * PostPrivacy.ONLY_ME // for only me post
 * ...
 */
const PostPrivacy = {
  PUBLIC: "public",
  ONLY_ME: "only_me",
  CHHIMEK: "chhimek",
};

export default PostPrivacy;
