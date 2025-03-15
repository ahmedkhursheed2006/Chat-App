import { X } from "lucide-react"
import { useAuthStore } from "../lib/useAuthStore"
import { useChatStore } from "../lib/useChatStore"
import { useGroupStore } from "../lib/useGroupStore";

function ChatHeader() {

    const { selectedUser, setSelectedUser } = useChatStore();
    const { selectedGroup, setSelectedGroup } = useGroupStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            {selectedUser && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                            <div className="size-10 rounded-full relative">
                                <img src={selectedUser.profilePic || "/GroupAvatar.png"} alt={selectedUser.fullName} />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium">{selectedUser.fullName}</h3>
                            <p className="text-sm text-base-content/70">
                                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => {setSelectedUser(null); setSelectedGroup(null)}}>
                        <X />
                    </button>
                </div>)}
            {selectedGroup && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                            <div className="size-10 rounded-full relative">
                                <img src={selectedGroup.groupPic || "/Avatar.jpg"} alt={selectedGroup.groupName} />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium">{selectedGroup.groupName}</h3>
                            <p className="text-sm text-base-content/70">
                                Members
                            </p>
                        </div>
                    </div>
                    <button onClick={() => {setSelectedUser(null); setSelectedGroup(null)}}>
                        <X />
                    </button>
                </div>
            )}
        </div>

    )
}

export default ChatHeader