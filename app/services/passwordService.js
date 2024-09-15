import bcrypt from "bcrypt";
import PasswordValidator from "password-validator";
import logger from "../utils/logger.js";

// saltRounds is the number of rounds the data is processed for. The higher the number, the more secure but slower.
const saltRounds = 10;

/**
 * @description - Encrypt password using bcrypt
 * @param {string} password - Password to encrypt
 * @returns {Promise<string>} - Encrypted password
 * @example hashPassword("password"); // returns "$2b$10$yK3Fq2WZ2a3y9vJ3k7JZ4e9V7Y0ZI9Q1H8K1oG9sZ8q3M3t5jJf3S"
 */
export const hashPassword = async (password) => {
  if (!password) return null;

  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};

/**
 * @description - Compare password with encrypted password
 * @param {string} password - Password to compare
 * @param {string} encryptedPassword - Encrypted password
 * @returns {Promise<boolean>} - True if password matches, false otherwise
 * @example comparePassword("password", "$2b$10$yK3Fq2WZ2a3y9vJ3k7JZ4e9V7Y0ZI9Q1H8K1oG9sZ8q3M3t5jJf3S"); // returns true
 */
export const comparePassword = async (password, encryptedPassword) => {
  if (!password || !encryptedPassword) return false;

  return await bcrypt.compare(password, encryptedPassword);
};

/**
 * @description - Validate password
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password is valid, false otherwise
 * @example validatePassword("password"); // returns true
 */
export const validatePassword = (password) => {
  if (!password) return false;

  const schema = new PasswordValidator();

  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces(); // Should not have spaces

  return schema.validate(password);
};
