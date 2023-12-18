// @ts-nocheck
import config from "@/config/index.js";
import io from "socket.io-client";

export function getConnection() {
  const socket = io(config.api_socket, {
    extraHeaders: {
      Events: "message",
    },
  });
  const _dataHandlers = [];

  socket.on("connect", () => console.log("socket.connected", socket.connected));
  socket.on("disconnect", () => console.log("socket.connected", socket.connected));

  // Listen for events from the server
  socket.on("message", data => {
    console.log("Received data from server:", data);
    _dataHandlers.forEach(handler => handler(data));
  });

  return {
    _socket: socket,
    send(data) {
      socket.emit("message", data);
    },
    onData(handler) {      
      _dataHandlers.push(handler);
    },
    disconnect() {
      socket.disconnect();
    },
  };
}
