import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        creator: {
            type: String,   
            required: true
        },
        createdAt: {
            type: Date, default: Date.now
        },
    },
    { timestamps: true }
);
const Group = mongoose.model("Group", groupSchema);

export default Group;
