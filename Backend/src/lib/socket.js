import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Store online users & their socket IDs
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // ✅ Handle joining a group room
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
  });

 

  // ✅ Handle leaving a group
  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // Returns the socket ID if user is online
}
 

export { io, app, server };
