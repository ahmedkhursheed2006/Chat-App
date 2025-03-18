import React, { useEffect, useState } from 'react';
import { useChatStore } from '../lib/useChatStore';
import { useGroupStore } from '../lib/useGroupStore';
import SidebarSkeleton from './Skeletons';
import { Users, MessageSquare, UsersRound } from 'lucide-react';
import { useAuthStore } from '../lib/useAuthStore';
import GroupCard from './GroupCard';

function Sidebar() {
    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { setGroupCardOpen, groupCardOpen, selectedGroup, setSelectedGroup, groups, getGroups } = useGroupStore();
    const { onlineUsers } = useAuthStore();


    const [showOnlineOnly, setOnlineShowOnly] = useState(false);
    const [activeTab, setActiveTab] = useState('contacts'); // "contacts" | "dm" | "groups"

    useEffect(() => {
        getUsers();
        getGroups();
    }, [getUsers, getGroups]);

    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className='h-full w-20 lg:w-72 border-4 border-r-0 border-[#ccc] rounded-l-lg flex flex-col transition-all duration-200 '>
            {/* Tabs for Navigation */}
            <div className="border-b border-base-300 w-full p-1.5 flex justify-around">
                <button
                    className={`flex flex-col items-center p-2 ${activeTab === "contacts" ? "text-blue-500" : "text-gray-500"}`}
                    onClick={() => setActiveTab("contacts")}
                >
                    <Users className='size-6' />
                    <span className='text-xs hidden lg:block'>Contacts</span>
                </button>
                <button
                    className={`flex flex-col items-center p-2 ${activeTab === "dm" ? "text-blue-500" : "text-gray-500"}`}
                    onClick={() => setActiveTab("dm")}
                >
                    <MessageSquare className='size-6' />
                    <span className='text-xs hidden lg:block'>DM</span>
                </button>
                <button
                    className={`flex flex-col items-center p-2 ${activeTab === "groups" ? "text-blue-500" : "text-gray-500"}`}
                    onClick={() => setActiveTab("groups")}
                >
                    <UsersRound className='size-6' />
                    <span className='text-xs hidden lg:block'>Groups</span>
                </button>
            </div>

            {/* Show Online Only Toggle (Only for Contacts) */}
            {activeTab === "contacts" && (
                <div className='mt-3 hidden lg:flex items-center gap-2 px-5'>
                    <label className='cursor-pointer flex items-center gap-2'>
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setOnlineShowOnly(e.target.checked)}
                            className='checkbox checkbox-sm'
                        />
                        <span className='text-sm'>Show Online Only</span>
                    </label>
                    <span className='text-xs text-[#333]'>({onlineUsers.length - 1} online )</span>
                </div>
            )}

            {/* Sidebar Content Based on Active Tab */}
            <div className='overflow-y-auto w-full py-3'>
                {/* Contacts Tab */}
                {activeTab === "contacts" && (
                    filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => {setSelectedUser(user); setSelectedGroup(null)}}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
                        >
                            <div className='relative mx-auto lg:mx-0'>
                                <img src={user.profilePic || "/Avatar.jpg"} alt={user.name} className='size-12 object-cover rounded-full' />
                                {onlineUsers.includes(user._id) && (
                                    <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full' />
                                )}
                            </div>
                            <div className='hidden lg:block text-left min-w-0'>
                                <div className='font-medium truncate'>{user.fullName}</div>
                                <div className='text-xs text-[#21d139]'>
                                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                </div>
                            </div>
                        </button>
                    ))
                )}

                {/* DM Tab */}
                {activeTab === "dm" && (
                    users.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => {setSelectedUser(user); setSelectedGroup(null)}}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
                        >
                            <div className='relative mx-auto lg:mx-0'>
                                <img src={user.profilePic || "/Avatar.jpg"} alt={user.name} className='size-12 object-cover rounded-full' />
                            </div>
                            <div className='hidden lg:block text-left min-w-0'>
                                <div className='font-medium truncate'>{user.fullName}</div>
                            </div>
                        </button>
                    ))
                )}


                {/* Groups Tab */}
                {activeTab === "groups" && (
                    <div>
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <button
                                    key={group._id}
                                    onClick={() => {setSelectedUser(null); setSelectedGroup(group)}}
                                    className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                                        ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
                                >
                                    <UsersRound className="size-6" />
                                    <span className='hidden lg:block'>{group.name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-4">
                                <p className="text-gray-500">No groups available</p>
                                <button
                                    onClick={() => setGroupCardOpen(true)}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    Create Group
                                </button>
                            </div>
                        )}
                    </div>
                )}


                {/* No Users or Groups Found */}
                {(activeTab === "contacts" && filteredUsers.length === 0) && (
                    <div className='text-center text-[#333] py-4'>No Online Users</div>
                )}
            </div>

            {/* Group Card Modal */}
            {groupCardOpen? (<GroupCard/>):""}
        </aside>
    );
}

export default Sidebar;
