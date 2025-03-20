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
      console.log("Group created:", res.data);
      socket.emit("joinGroup", res.data._id); // Automatically join the new group
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
      console.error("Error creating group:", error.response?.data);
    }
  },
  getGroups: async () => {
    try {
      const res = await axiosInstance.get(`/groups`);
      set({ groups: res.data }); // Store fetched groups
      console.log("Fetched groups:", res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
      console.error("Error fetching groups:", error.response?.data);
    }
  },
  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groupMessages/${groupId}`);
      set({ groupMessages: res.data });
      console.log("Fetched group messages for group:", groupId, res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch group messages");
      console.error("Error fetching group messages:", error.response?.data);
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },
  sendGroupMessage: async (messageData) => {
    const { selectedGroup, groupMessages } = get();
    const {senderId} = messageData;
    console.log("Sender ID: ", senderId);
    
    const socket = useAuthStore.getState().socket;
    try {
      console.log("Sending group message to API:", messageData);
      const res = await axiosInstance.post(`/groupMessages/${selectedGroup._id}`, messageData);
      console.log("API Response:", res);
      
      
      set({ groupMessages: [...groupMessages, res.data] });

      // Ensure the senderId is part of the emitted message
      socket.emit("sendGroupMessage", { groupId: selectedGroup._id, message: res.data });
      console.log("Message sent to socket:", { groupId: selectedGroup._id, message: res.data });

      return res;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send group message");
      console.error("Error sending group message:", error.response?.data);
    }
  },

  // Socket handling
  joinGroup: (groupId) => {
    const socket = useAuthStore.getState().socket;
    socket.emit("joinGroup", groupId);
    console.log("Joining group:", groupId);
  },
  subscribeToGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    const {selectedGroup} = get();
    if(!selectedGroup) return
    if(!socket) console.log("Sokcet not connected");
    
    console.log("Subscribing to group messages for group:", selectedGroup._id);
    socket.on("receiveGroupMessage", (newMessage) => {
      
      if (newMessage.groupId !== selectedGroup._id) return;
      console.log("Received new group message:", newMessage);
      set({
        groupMessages: [...get().groupMessages, newMessage],
    });
    });
  },
  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("receiveGroupMessage");
    console.log("Unsubscribed from group messages");
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