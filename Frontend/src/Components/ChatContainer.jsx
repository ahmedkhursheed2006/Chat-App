import { useEffect, useRef } from "react";
import { useChatStore } from "../lib/useChatStore"; // For DMs
import { useGroupStore } from "../lib/useGroupStore"; // For Groups
import { useAuthStore } from "../lib/useAuthStore";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

function ChatContainer({ chatId, chatType }) {
    const { authUser } = useAuthStore();

    // Use correct store based on chat type
    const isGroupChat = chatType === "group";
    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { groups, groupMessages, getGroupMessages, joinGroup, subscribeToGroupMessages, unsubscribeFromGroupMessages } = useGroupStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        if (isGroupChat) {
            joinGroup(chatId);
            getGroupMessages(chatId);
            subscribeToGroupMessages(chatId);
            return () => unsubscribeFromGroupMessages(chatId);
        } else {
            getMessages(selectedUser._id);
            subscribeToMessages();
            return () => unsubscribeFromMessages();
        }
    }, [chatId, chatType, selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages, joinGroup, getGroupMessages, subscribeToGroupMessages, unsubscribeFromGroupMessages]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [isGroupChat ? groupMessages[chatId] : messages]);

    if (isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput chatId={chatId} chatType={chatType} />
        </div>
    );

    const chatMessages = isGroupChat ? groupMessages[chatId] || [] : messages;

    return (
        <div className="flex flex-1 flex-col overflow-auto h-100vh">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-12.9rem)] no-scrollbar">
                {chatMessages.map((message) => (
                    <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} ref={messageEndRef}>
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img src={message.senderId === authUser._id ? authUser.profilePic || "/Avatar.jpg" : message.senderProfilePic || "/Avatar.jpg"} alt="Profile Pic" />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput chatId={chatId} chatType={chatType} />
        </div>
    );
}

export default ChatContainer;
