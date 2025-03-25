import React, { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../lib/useChatStore";
import { useGroupStore } from "../lib/useGroupStore";
import SidebarSkeleton from "./Skeletons";
import { Users, UsersRound } from "lucide-react";
import { useAuthStore } from "../lib/useAuthStore";
import GroupCard from "./GroupCard";

const UserButton = React.memo(({ user, isSelected, onlineUsersSet, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
      isSelected ? "bg-base-300 ring-1 ring-base-300" : ""
    }`}
  >
    <div className="relative mx-auto lg:mx-0">
      <img
        src={user.profilePic || "/Avatar.jpg"}
        alt={user.fullName}
        className="size-12 object-cover rounded-full"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/Avatar.jpg";
        }}
      />
      {onlineUsersSet.has(user._id) && (
        <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full" />
      )}
    </div>
    <div className="hidden lg:block text-left min-w-0">
      <div className="font-medium truncate">{user.fullName}</div>
      <div className="text-xs text-[#21d139]">
        {onlineUsersSet.has(user._id) ? "Online" : "Offline"}
      </div>
    </div>
  </button>
));

const GroupButton = React.memo(({ group, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
      isSelected ? "bg-base-300 ring-1 ring-base-300" : ""
    }`}
  >
    <UsersRound className="size-6" />
    <span className="hidden lg:block">{group.name}</span>
  </button>
));

const TabButton = React.memo(({ active, onClick, icon: Icon, label }) => (
  <button
    className={`flex flex-col items-center p-2 ${
      active ? "text-blue-500" : "text-gray-500"
    }`}
    onClick={onClick}
  >
    <Icon className="size-6" />
    <span className="text-xs hidden lg:block">{label}</span>
  </button>
));

function Sidebar() {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const {
    setGroupCardOpen,
    groupCardOpen,
    selectedGroup,
    setSelectedGroup,
    groups,
    getGroups,
  } = useGroupStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setOnlineShowOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");

  const onlineUsersSet = useMemo(() => new Set(onlineUsers), [onlineUsers]);
  
  const filteredUsers = useMemo(
    () =>
      showOnlineOnly
        ? users.filter((user) => onlineUsersSet.has(user._id))
        : users,
    [users, showOnlineOnly, onlineUsersSet]
  );

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-1.5 flex justify-around">
        <TabButton
          active={activeTab === "contacts"}
          onClick={() => setActiveTab("contacts")}
          icon={Users}
          label="Contacts"
        />
        <TabButton
          active={activeTab === "groups"}
          onClick={() => setActiveTab("groups")}
          icon={UsersRound}
          label="Groups"
        />
      </div>

      {activeTab === "contacts" && (
        <div className="mt-3 hidden lg:flex items-center gap-2 px-5">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setOnlineShowOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show Online Only</span>
          </label>
          <span className="text-xs text-[#333]">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      )}

      <div className="overflow-y-auto w-full py-3">
        {activeTab === "contacts" ? (
          <>
            {filteredUsers.map((user) => (
              <UserButton
                key={user._id}
                user={user}
                isSelected={selectedUser?._id === user._id}
                onlineUsersSet={onlineUsersSet}
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedGroup(null);
                }}
              />
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center text-[#333] py-4">No Online Users</div>
            )}
          </>
        ) : (
          <div>
            <div className="flex items-center justify-center w-full">
              <button
                onClick={() => setGroupCardOpen(true)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Create Group
              </button>
            </div>
            {groups.length > 0 ? (
              groups.map((group) => (
                <GroupButton
                  key={group._id}
                  group={group}
                  isSelected={selectedGroup?._id === group._id}
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedGroup(group);
                  }}
                />
              ))
            ) : (
              <p className="text-gray-500">No groups available</p>
            )}
          </div>
        )}
      </div>

      {groupCardOpen && <GroupCard />}
    </aside>
  );
}

export default React.memo(Sidebar);