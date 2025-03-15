import express from "express";
import { sendGroupMessage, getGroupMessages } from "../controllers/groupMessage.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route to send a message to a group
router.post("/:groupId", protectRoute, sendGroupMessage);

// Route to get messages from a specific group
router.get("/:groupId", protectRoute, getGroupMessages);

export default router;
 