import { X } from "lucide-react"
import { useAuthStore } from "../lib/useAuthStore"
import { useChatStore } from "../lib/useChatStore"
import { Link } from "react-router";

function ChatHeader() {

    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <Link to={`/${selectedUser?._id}/profile`} className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/Avatar.jpg"} alt={selectedUser.fullName} />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </Link>
                <button onClick={()=> setSelectedUser(null)} className="cursor-pointer">
                    <X/>
                </button>
            </div>
        </div>
    )
}

export default ChatHeader
