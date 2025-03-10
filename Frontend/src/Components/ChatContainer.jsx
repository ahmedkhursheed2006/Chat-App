import { useEffect } from "react";
import { useChatStore } from "../lib/useChatStore"

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../lib/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useRef } from "react";

function ChatContainer() {
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null) 


    useEffect(() => {
        getMessages(selectedUser._id)

        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])
    useEffect(() => {
        if (messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({ behavior: "smooth" })}
    }, [messages])

    if (isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />
        </div>
    )



    return (
        <div className="flex flex-1 flex-col overflow-auto h-100vh">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-12.9rem)] no-scrollbar">
                {messages.map((message) => (
                    <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} ref={messageEndRef}>
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img src={message.senderID === authUser._id ? authUser.profilePic || "/Avatar.jpg" : selectedUser.profilePic || "/Avatar.jpg"} alt="Profile Pic" />

                            </div>
                        </div>
                        <div className="chat-header mb-1 ">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col ">
                            {message.image && (
                                <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput />

        </div>
    )
}

export default ChatContainer
