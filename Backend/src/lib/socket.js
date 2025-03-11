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

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // **JOIN GROUP CHAT**
  socket.on("joinGroup", ({ groupId }) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  // **SEND GROUP MESSAGE**
  socket.on("sendGroupMessage", async ({ groupId, senderId, message }) => {
    try {
      const newMessage = { sender: senderId, groupId, text: message, timestamp: Date.now() };

      // Broadcast message to everyone in the group
      io.to(groupId).emit("receiveGroupMessage", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });




  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };