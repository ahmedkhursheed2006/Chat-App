import { useEffect, useRef, useMemo } from "react";
import React from "react";
import { Link } from "react-router";
import { useChatStore } from "../lib/useChatStore";
import { useAuthStore } from "../lib/useAuthStore";
import { useGroupStore } from "../lib/useGroupStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const Message = ({ message, isSender, senderProfilePic }) => (
    <div className={`chat ${isSender ? "chat-end" : "chat-start"}`}>
        <div className="chat-image avatar">
            <div className="size-10 rounded-full border">
                <img
                    src={senderProfilePic || "/Avatar.jpg"}
                    alt="Profile"
                    onError={(e) => {
                        e.target.src = "/Avatar.jpg";
                    }}
                />
            </div>
        </div>
        <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
            </time>
        </div>
        <div className="chat-bubble flex flex-col">
            {message.image && (
                <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                />
            )}
            {message.text && <p>{message.text}</p>}
        </div>
    </div>
);

function ChatContainer() {


    const messageEndRef = useRef(null);
    const { authUser, socket } = useAuthStore();
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages
    } = useChatStore();

    const {
        groupMessages,
        getGroupMessages,
        isGroupMessagesLoading,
        selectedGroup,
        subscribeToGroupMessages,
        unsubscribeFromGroupMessages
    } = useGroupStore();

    const currentChat = useMemo(() => ({
        id: selectedGroup?._id || selectedUser?._id,
        messages: selectedGroup ? groupMessages : messages,
        isGroup: !!selectedGroup,
        profilePic: selectedGroup?.profilePic || selectedUser?.profilePic
    }), [selectedGroup, selectedUser, groupMessages, messages]);

    // Handle message subscriptions
    useEffect(() => {
        if (!currentChat.id || !socket) return;

        if (currentChat.isGroup) {
            getGroupMessages(currentChat.id);
            subscribeToGroupMessages();
            return () => unsubscribeFromGroupMessages();
        } else {
            getMessages(currentChat.id);
            subscribeToMessages();
            return () => unsubscribeFromMessages();
        }
    }, [currentChat.id, currentChat.isGroup, socket]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentChat.messages]);

    if (isMessagesLoading || isGroupMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />

                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col overflow-auto p-2 rounded-r-lg">
            <Link to={`/:id/profile`}>
            <ChatHeader/>
            </Link>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentChat.messages?.map((message) => (
                    <Message
                        key={`${currentChat.isGroup ? 'group' : 'user'}-${message._id}`}
                        message={message}
                        isSender={message.senderId === authUser?._id}
                        senderProfilePic={
                            message.senderId === authUser?._id
                                ? authUser.profilePic
                                : currentChat.profilePic
                        }
                    />
                ))}
                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    );
}

export default ChatContainer;