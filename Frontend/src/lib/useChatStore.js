import { create } from "zustand";
import toast from "react-hot-toast"
import { axiosInstance } from "./axios";
import {useAuthStore} from "./useAuthStore"

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessegesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/users")
            set({ users: res.data })

        } catch (error) {
            toast.error(error.response.data.messege);

        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data })

        } catch (error) {
            toast.error(error.response.data.messege);

        } finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (messageData) =>{
        const {selectedUser, messages} = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({messages:[...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    subscribeToMessages: async () => {
        const {selectedUser} = get()
        if(!selectedUser) return;

        const socket = useAuthStore.getState().sokcet
        socket.on("newMessage", (newMessage) =>{
            if(newMessage.senderID !== selectedUser._id) return;
            set({
                messages : [...get().messages, newMessage],
            })
        })
    },
    unSubscribeToMessages: async () => {
        const socket = useAuthStore.getState().sokcet
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),


}))