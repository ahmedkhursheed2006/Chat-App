import { useEffect } from "react";
import { useChatStore } from "../lib/useChatStore"

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../lib/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useRef } from "react";
import { useGroupStore } from "../lib/useGroupStore";

function ChatContainer() {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unSubscribeToMessages } = useChatStore();
    const { groupMessages, getGroupMessages, isGroupMessagesLoading, selectedGroup, subscribeToGroupMessages, unsubscribeFromGroupMessages } = useGroupStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null)


    useEffect(() => {
        if (selectedUser && !selectedGroup) {
            getMessages(selectedUser._id);
            subscribeToMessages();
            return () => unSubscribeToMessages();
        }
    }, [selectedUser, getMessages, subscribeToMessages, unSubscribeToMessages]);

    useEffect(() => {
        if (selectedGroup && !selectedUser) {
            getGroupMessages(selectedGroup._id);
            subscribeToGroupMessages();
            return () => unsubscribeFromGroupMessages();
        }
    }, [selectedGroup, getGroupMessages, subscribeToGroupMessages, unsubscribeFromGroupMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages && groupMessages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, groupMessages])

    if (isMessagesLoading || isGroupMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    )



    return (
        <div className="flex flex-1 flex-col overflow-auto border-4 border-l-0 border-[#ccc] p-2 rounded-r-lg ">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedUser && messages && messages.map((message) => (
                    <div key={message._id} className={`chat ${message.senderId === authUser?._id ? "chat-end" : "chat-start"}`} ref={messageEndRef}>
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img src={message.senderId === authUser?._id ? authUser?.profilePic || "/Avatar.jpg" : selectedUser?.profilePic || "/Avatar.jpg"} alt="Profile Pic" />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
                {selectedGroup && groupMessages && groupMessages.map((groupMessage) => {
                    console.log("Message Sender:", groupMessage.senderId);
                    console.log("Current User:", authUser?._id);
                    return (
                    
                    <div key={groupMessage._id} className={`chat ${String(groupMessage.senderId) === String(authUser?._id) ? "chat-end" : "chat-start"}`} ref={messageEndRef}>
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img src={String(groupMessage.senderId) === String(authUser?._id) ? authUser?.profilePic || "/Avatar.jpg" : selectedGroup?.profilePic || "/Avatar.jpg"} alt="Profile Pic" />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(groupMessage.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {groupMessage.image && <img src={groupMessage.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />}
                            {groupMessage.text && <p>{groupMessage.text}</p>}
                        </div>
                    </div>
                )})}
            </div>
            <MessageInput />
        </div>
    );

}

export default ChatContainer