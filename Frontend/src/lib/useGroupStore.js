import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
  groupMessages: {}, // { groupId: [messages] }
  selectedGroup: null,
  isMessagesLoading: false,
  isGroupUpdating: false,
  groups: [],
  groupCardOpen: null,
  groupUpdate: null,

  createGroup: async (groupData) =>{
    console.log(groupData);
    
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      toast.success("Group created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to create group");
    }
  },
  
  updateGroup: async (data) => {
    set({ isGroupUpdating: true });
    try {
      const res = await axiosInstance.put("/auth/update-group", data);
      set({ groupUpdate: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupUpdating: false });
    }
  },


  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/messages/${groupId}`);
      set((state) => ({
        groupMessages: { ...state.groupMessages, [groupId]: res.data },
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendGroupMessage: async (groupId, messageData) => {
    try {
      const res = await axiosInstance.post(`/groups/messages/send/${groupId}`, messageData);
      set((state) => ({
        groupMessages: {
          ...state.groupMessages,
          [groupId]: [...(state.groupMessages[groupId] || []), res.data],
        },
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  joinGroup: (groupId) => {
    const socket = useAuthStore.getState().socket;
    socket.emit("joinGroup", groupId);
  },

  subscribeToGroupMessages: (groupId) => {
    const socket = useAuthStore.getState().socket;
    socket.on("newGroupMessage", (newMessage) => {
      if (newMessage.groupId !== groupId) return;

      set((state) => ({
        groupMessages: {
          ...state.groupMessages,
          [groupId]: [...(state.groupMessages[groupId] || []), newMessage],
        },
      }));
    });
  },

  unsubscribeFromGroupMessages: (groupId) => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGroupMessage");
  },

  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setGroupCardOpen: (groupCardOpen) => set({ groupCardOpen }),
}));
