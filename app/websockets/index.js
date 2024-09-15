import SocketEvent from "../enums/socketEvent.js";
import { verifyToken } from "../utils/jwtUtil.js";
import db from "../models/index.js";
import ApiError from "../utils/apiError.js";
const { User, Role, RefreshToken } = db;

//TODO: Need to integrate complete flow with socket.io
const initializeWebSocketServer = (wss) => {
  wss.on(SocketEvent.CONNECTION, function connection(ws, req) {
    ws.on("error", console.error);

    ws.on("message", function message(data) {
      console.log("received: %s", data);
      ws.send(JSON.stringify({ message: data.toString() }));
    });

    ws.send("something");
    ws.send("something .. ..  .");
  });
};

export { initializeWebSocketServer };
