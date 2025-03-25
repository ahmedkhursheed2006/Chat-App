import User from "../models/user.model.js"
import Group from "../models/group.model.js"


export const create = async (req, res) => {
    const { name, members, createdBy, profilePic } = req.body;
    
    try {
        if (!name || !members || !Array.isArray(members) || members.length < 2) {
            return res.status(400).json({ error: "A group must have a name and at least two members." });
        }
        if (!createdBy) {
            return res.status(400).json({ error: "Group creator (createdBy) is required." });
        }
        const uniqueMembers = [...new Set(members)];
        const newGroup = new Group({
            name,
            members: uniqueMembers,
            createdBy,
            profilePic: profilePic || null, // Default to `null` if no profile picture
        });
        await newGroup.save();
        return res.status(201).json(newGroup);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addMember = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        const group = await Group.findByIdAndUpdate(
            groupId,
            { $push: { members: userId } },
            { new: true }
        );
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: "Error adding user" });
    }
};

export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user._id }).populate("members", "username email");
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: "Error fetching groups" });
    }
};

export const updateGroup = async (req, res) => {
    try {
        const { groupId, name } = req.body;
        const group = await Group.findByIdAndUpdate(
            groupId,
            { name },
            { new: true }
        );
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: "Error updating group" });
    }
};
