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
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // ✅ Handle joining a group room
  socket.on("joinGroup", (groupId) => {
    if (!groupId) return console.error("⚠️ Missing groupId for joinGroup");
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  // ✅ Handle sending group messages
  socket.on("sendGroupMessage", ({ groupId, message }) => {
    if (!groupId || !message) {
      return console.error("⚠️ Missing data for sendGroupMessage", { groupId, message });
    }
    console.log(`New group message in ${groupId}:`, message);

    // Broadcast to everyone in the group (except sender)
    socket.to(groupId).emit("receiveGroupMessage", { groupId, message });
  });

  // ✅ Handle leaving a group
  socket.on("leaveGroup", (groupId) => {
    socket.leave(groupId);
    console.log(`User left group: ${groupId}`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // Returns the socket ID if user is online
}
 

export { io, app, server };
