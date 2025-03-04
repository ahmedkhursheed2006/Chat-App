import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getUsersForSidebar , getMesseges, sendMessage } from "../controllers/message.controller.js"

const router = express.Router()

router.get("/users", protectRoute, getUsersForSidebar)
router.get("/:id", protectRoute, getMesseges)

router.post("/send/:id", protectRoute, sendMessage)

export default router;