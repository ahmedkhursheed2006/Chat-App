import { Server } from "socket.io";
import http from "http";
import express from "express";
import GroupMessage from "../models/groupMessage.model.js"; // ✅ Import Mongoose model

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {}; // { userId: socketId }
const groupSocketMap = {}; // { groupId: [socketId1, socketId2, ...] }

io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // **JOIN GROUP CHAT**
    socket.on("joinGroup", ({ groupId }) => {
        socket.join(groupId);

        if (!groupSocketMap[groupId]) {
            groupSocketMap[groupId] = [];
        }
        if (!groupSocketMap[groupId].includes(socket.id)) {
            groupSocketMap[groupId].push(socket.id);
        }

        console.log(`🔗 User ${userId} joined group ${groupId}`);
    });

    // **SEND GROUP MESSAGE**
    socket.on("sendGroupMessage", async ({ groupId, senderId, message }) => {
        try {
            // ✅ Correctly save message in MongoDB
            const newMessage = new GroupMessage({
                senderId,
                groupId,
                text: message,
                timestamp: Date.now(),
            });

            await newMessage.save(); // ✅ Now this works!

            console.log("📩 Message saved & broadcasting to group:", groupId);

            // ✅ Broadcast message to everyone in the group
            io.to(groupId).emit("receiveGroupMessage", newMessage);
        } catch (error) {
            console.error("❌ Error sending group message:", error);
        }
    });

    // **HANDLE DISCONNECT**
    socket.on("disconnect", () => {
        console.log("❌ A user disconnected:", socket.id);

        if (userId && userSocketMap[userId]) {
            delete userSocketMap[userId];
        }

        Object.keys(groupSocketMap).forEach((groupId) => {
            groupSocketMap[groupId] = groupSocketMap[groupId].filter(
                (id) => id !== socket.id
            );
        });

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export { io, app, server };
