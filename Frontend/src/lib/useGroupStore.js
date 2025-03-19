import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const socket = useAuthStore.getState().socket;

export const useGroupStore = create((set, get) => ({
  groupMessages: [],
  selectedGroup: null,
  isGroupMessagesLoading: false,
  isGroupUpdating: false,
  groups: [],
  groupCardOpen: null,
  groupUpdate: null,

  // API calls
  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      set((state) => ({ groups: [...state.groups, res.data] }));
      toast.success("Group created successfully");
      socket.emit("joinGroup", res.data._id); // Automatically join the new group
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  },
  getGroups: async () => {
    try {
      const res = await axiosInstance.get(`/groups`);
      set({ groups: res.data }); // Store fetched groups
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    }
  },
  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groupMessages/${groupId}`);
      set({ groupMessages: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "Failed to fetch group messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },
  sendGroupMessage: async (messageData) => {
    const { selectedGroup, groupMessages } = get();
    try {
      console.log("Sending group message to API:", messageData);
      const res = await axiosInstance.post(`/groupMessages/${selectedGroup._id}`, messageData);
      console.log("API Response:", res);
      set({ groupMessages: [...groupMessages, res.data] });
      socket.emit("sendGroupMessage", { groupId: selectedGroup._id, message: res.data, senderId: messageData.senderId });
      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send group message");
    }
  },

  // Socket handling
  joinGroup: (groupId) => {
    socket.emit("joinGroup", groupId);
  },
  subscribeToGroupMessages: (groupId) => {
    socket.on("receiveGroupMessage", (newMessage) => {
      if (newMessage.groupId !== groupId) return;
      console.log("Received new group message:", newMessage);
      set((state) => ({
        groupMessages: [...state.groupMessages, newMessage],
      }));
    });
  },
  unsubscribeFromGroupMessages: () => {
    socket.off("receiveGroupMessage");
  },

  // State setters
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  setGroupCardOpen: (groupCardOpen) => set({ groupCardOpen }),
}));