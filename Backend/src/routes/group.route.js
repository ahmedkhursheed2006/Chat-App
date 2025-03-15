import express from 'express'
import { create, addMember, getGroups } from '../controllers/group.controller.js';
import { updateGroup } from '../controllers/group.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post("/create", create)
router.post("/addMember", addMember)
router.get("/",protectRoute, getGroups)
router.put("/update-group", updateGroup);

export default router