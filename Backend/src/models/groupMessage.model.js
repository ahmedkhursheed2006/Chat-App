import mongoose from "mongoose";


const GroupMessageSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,

        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

const GroupMessage = mongoose.model("GroupMessage", GroupMessageSchema);
export default GroupMessage;
