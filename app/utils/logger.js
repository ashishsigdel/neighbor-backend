import winston from "winston";
import { rootDir } from "../services/fileStorageService.js";
const { combine, timestamp, printf, colorize } = winston.format;

// Define log format
const logFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }),
  colorize({
    all: true,
  })
);

const logger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: `${rootDir}/logs/error.log`,
      level: "error",
    }),

    new winston.transports.File({
      filename: `${rootDir}/logs/combined.log`,
    }),

    new winston.transports.Console(),
  ],
  levels: winston.config.npm.levels,
  exitOnError: false,
});

export default logger;
