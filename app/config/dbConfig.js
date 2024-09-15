import logger from "../utils/logger.js";
import databaseConfig from "./database.js";

const dbConfig = databaseConfig[process.env.NODE_ENV || "development"];

import { Sequelize, DataTypes, Op } from "sequelize";

/**
 * Sequelize instance
 */
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+00:00",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

/**
 * authenticate
 * @description Test connection to database
 * */
sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });

/**
 * @description sync all models with database
 * @param {boolean} force - If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
 * @param {boolean} alter - If alter is true, existing tables will be altered.
 * */
sequelize.sync({ force: false, alter: false }).then(() => {
  logger.info("All models were synchronized successfully.");
});

export { sequelize, DataTypes, Op, Sequelize };
