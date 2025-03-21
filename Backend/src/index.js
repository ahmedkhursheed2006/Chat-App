import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js"
import cors from "cors"


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import groupRoutes from "./routes/group.route.js"
import groupMessageRoutes from "./routes/groupMessage.route.js"
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/groupMessages", groupMessageRoutes);


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});