import httpServer from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import logger from "./app/utils/logger.js";

/**
 * @file server.js
 * @description Server entry point
 * @module Server
 * @requires dotenv
 * @requires app
 * @requires constants
 * @requires logger
 */
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  logger.info(`⚙️ Server is running on port https://localhost:${PORT} ⚙️`);
});
