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

  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      set((state) => ({ groups: [...state.groups, res.data] }));


      toast.success("Group created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to create group");
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
  // updateGroup: async (data) => {
  //   set({ isGroupUpdating: true });
  //   try {
  //     const res = await axiosInstance.put("/auth/update-group", data);
  //     set({ groupUpdate: res.data });
  //     toast.success("Profile updated successfully");
  //   } catch (error) {
  //     console.log("error in update profile:", error);
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isGroupUpdating: false });
  //   }
  // },
  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groupMessages/${groupId}`);
      set({ groupMessages: res.data });


    } catch (error) {
      toast.error(error.response.data.message);
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
      return res;

    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  joinGroup: (groupId) => {
    const socket = useAuthStore.getState().socket;
    socket.emit("joinGroup", groupId);
  },
  subscribeToGroupMessages: (groupId) => {
    const socket = useAuthStore.getState().socket;
    socket.on("receiveGroupMessage", (newMessage) => {
      if (newMessage.groupId !== groupId) return;

      console.log("Received new group message:", newMessage);
      set((state) => ({
        groupMessages: [...state.groupMessages, data.message],
      }));

    });
  },
  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("receiveGroupMessage");
  },
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  setGroupCardOpen: (groupCardOpen) => set({ groupCardOpen }),
}));
