import jwt from "jsonwebtoken";

/**
 * @description Generate a JWT token
 * @param {object} payload - Payload to sign
 * @param {string} expiresIn - Expiration time in minutes
 * @returns {string} - JWT token string
 * @example generateToken({ payload: { id: 1 }, expiresIn: 5 }); // returns a JWT token with payload { id: 1 } and expiration time of 5 minutes
 */
export const generateToken = ({ payload, expiresIn }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn * 60, // convert minutes to seconds for expiresIn
    issuer: process.env.JWT_ISSUER, // issuer name for JWT
    algorithm: "HS512", // algorithm used to sign/verify JWT
  });

  return token;
};

/**
 * @description Verify a JWT token and return the payload
 * @param {string} token - JWT token string
 * @param {boolean} ignoreExpiration - Ignore expiration time check if true (default: false)
 * @returns {object} - JWT payload
 * @example verifyToken("token");
 */
export const verifyToken = ({ token, ignoreExpiration = false }) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER,
    algorithms: ["HS512"],
    ignoreExpiration: ignoreExpiration,
  });
};

/**
 * @description Remove bearer from JWT token string
 * @param {string} token - JWT token string
 * @returns {string} - JWT token string without bearer
 * @example removeBearer("Bearer token"); // returns plain token string
 */

export const removeBearer = (token) => {
  if (token && token.startsWith("Bearer ")) {
    return token.slice(7, token.length);
  }

  return token;
};

/**
 * @description Get JWT token from request header
 * @param {object} req - Request object
 * @returns {string} - JWT token string if exists, otherwise null
 * @example getAuthToken(req); // returns JWT token string
 */
export const getAuthToken = (req) => {
  if (
    req &&
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
};

/**
 * @description Get JWT token from request cookie
 * @param {object} req - Request object
 * @returns {string} - JWT token string if exists, otherwise null
 * @example getCookieToken(req); // returns JWT token string
 */
export const getCookieToken = (req) => {
  if (req && req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
};

/**
 * @description Generate a refresh token
 * @param {object} payload - Payload to sign (userId, roles)
 * @returns {string} - Refresh token string
 * @example generateRefreshToken({ userId: 1, roles: ["user"] });
 * @property {number} userId - User ID
 * @property {string[]} roles - User roles
 */
export const generateRefreshToken = ({ userId, roles }) => {
  return generateToken({
    payload: {
      id: userId,
      roles,
    },
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * @description Generate an access token
 * @param {object} payload - Payload to sign (userId, roles, refreshTokenId)
 * @returns {string} - Access token string
 * @example generateAccessToken({ userId: 1, roles: ["user"], refreshTokenId: 1 });
 * @property {number} userId - User ID
 * @property {string[]} roles - User roles
 * @property {number} refreshTokenId - Refresh token ID (used to validate/invalidate refresh token)
 */
export const generateAccessToken = ({ userId, roles, refreshTokenId }) => {
  return generateToken({
    payload: {
      id: userId,
      roles,
      rfId: refreshTokenId,
    },
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
