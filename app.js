import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { mw } from "request-ip";
import ErrorHandlerMiddleware from "./app/middlewares/error.middleware.js";
import ApiError from "./app/utils/apiError.js";
import { uploadsDir } from "./app/services/fileStorageService.js";
import APIRoute from "./app/routes/index.js";
import logger from "./app/utils/logger.js";
import UAParser from "ua-parser-js";
import swaggerUi from "swagger-ui-express";

import swaggerFile from "./swagger_output.json" with { type: "json" };

//sockets both ws and socket.io
// import { WebSocketServer } from "ws";
import { Server } from "socket.io";
import { initializeSocketIO } from "./app/socket/index.js";
// import { initializeWebSocketServer } from "./app/websockets/index.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.set("view engine", "ejs");

// Request IP middleware to get the IP address of the client
app.use(mw());

const httpServer = createServer(app);

// global middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use("/", express.static(uploadsDir)); // serve static files

// swagger
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerFile));

//log requests
app.use((req, res, next) => {
  const ua = UAParser(req.headers["user-agent"]);
  const ip = req.clientIp;
  const browser = ua.browser.name;
  const os = ua.os.name;
  const device = ua.device.model || ua.device.vendor || ua.device.type || "";
  const method = req.method;
  const url = req.originalUrl;

  process.env.NODE_ENV === "production" &&
    logger.info(`${method} ${url}  (${browser} - ${os} - ${device}) ${ip}`);

  next();
});

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 35, // Limit each IP to 35 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    throw new ApiError({
      status: 429,
      message: "Too many requests, please try again later.",
    });
  },
});

//  apply to all requests
app.use(limiter);

// initialize socket.io server
const io = new Server(httpServer, {
  pingTimeout: 60000,
  connectTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

// initialize ws server
// const wss = new WebSocketServer({
//   port: process.env.WS_PORT,
// });

// mount api routes
app.use("/api/v1", APIRoute);

//send 404 for all other routes
app.use("*", (req, res) => {
  throw new ApiError({
    status: 404,
    message: "Not Found",
    errors: [
      {
        message: `Cannot ${req.method} ${req.originalUrl}`,
      },
    ],
  });
});

//handle all errors
app.use(ErrorHandlerMiddleware);

//initialize socket
initializeSocketIO(io);

//initialize ws
// initializeWebSocketServer(wss);

export { app };

export default httpServer;
