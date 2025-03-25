import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";



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
      const socket = useAuthStore.getState().socket;
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
      console.log(res.data);
      
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
      toast.error(error.response?.data?.message || "Failed to fetch group messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },
  sendGroupMessage: async (messageData) => {
    const { selectedGroup, groupMessages } = get();
    
    const socket = useAuthStore.getState().socket;
    try {
      const res = await axiosInstance.post(`/groupMessages/${selectedGroup._id}`, messageData);
      
      
      set({ groupMessages: [...groupMessages, res.data] });

      // Ensure the senderId is part of the emitted message
      socket.emit("sendGroupMessage", { groupId: selectedGroup._id, message: res.data });

      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send group message");
    }
  },

  // Socket handling
  joinGroup: (groupId) => {
    const socket = useAuthStore.getState().socket;
    socket.emit("joinGroup", groupId);
  },
  subscribeToGroupMessages: () => {
    const {selectedGroup} = get();
    if(!selectedGroup) return
    const socket = useAuthStore.getState().socket;
    
    socket.on("newGroupMessage", (newMessage) => {
      
      set({
        groupMessages: [...get().groupMessages, newMessage],
    });
    
    });
  },
  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGroupMessage");
  },

  // State setters
  setSelectedGroup: (selectedGroup) => {
    if (selectedGroup) {
      get().joinGroup(selectedGroup._id);
    }
    set({ selectedGroup });
  },
  setGroupCardOpen: (groupCardOpen) => set({ groupCardOpen }),
}));