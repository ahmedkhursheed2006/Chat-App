import React, { useRef, useState } from 'react'
import { useChatStore } from '../lib/useChatStore';
import { Image, Send, X } from 'lucide-react';
import { useGroupStore } from '../lib/useGroupStore';
import { useAuthStore } from '../lib/useAuthStore';

function MessageInput() {

    const [text, setText] = useState("")
    const [previewImage, setPreviewImage] = useState(null)
    const fileInputRef = useRef(null);
    const { sendMessage, selectedUser } = useChatStore();
    const { sendGroupMessage, selectedGroup } = useGroupStore();
    const {authUser} = useAuthStore();
    
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please Select an Image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => { setPreviewImage(reader.result) }
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !previewImage) return;
    
        const messageData = {
            text: text.trim(),
            image: previewImage,
            senderId : authUser?._id
        };
    
        try {
    
            let response;
            if (selectedGroup && (selectedUser === null)) {
                response = await sendGroupMessage(messageData);
            } else if (selectedUser && (selectedGroup === null)) {
                response = await sendMessage(messageData);
            } else {
                console.log("No valid recipient found.");
                return;
            }
    
            console.log("Message sent successfully:", response?.data || "No data returned");
    
            setText("");
            setPreviewImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };
    



    return (
        <div className='p-4 w-full'>
            {previewImage && (
                <div className='mb-3 flex items-center gap-2'>
                    <div className='relative'>
                        <img src={previewImage} alt="Preview" className='size-20 object-cover rounded-lg border border-[#444]' />
                        <button onClick={removeImage} className='absolute -top-1.5 -right-1.5 size-5 rounded-fullbg-base-300 flex items-center justify-center' type='button'>
                            <X className='size-3' />
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
                <div className='flex-1 flex gap-2 '>

                    <input type="text" className='w-full input input-bordered rounded-lg input-sm sm:input-md' placeholder='Type a Message...' value={text} onChange={(e) => setText(e.target.value)} />

                    <input type="file" accept='image/*' className='hidden' ref={fileInputRef} onChange={handleImageChange} />

                    <button type="button" className={`hidden sm:flex btn btn-circle cursor-pointer ${previewImage ? "text-emerald-500" : "text-[#444]"}`} onClick={() => fileInputRef.current?.click()}><Image size={20} /></button>
                </div>
                <button type="submit" className='btn btn-sm btn-circle cursor-pointer' disabled={!text.trim() && !previewImage}>
                    <Send size={20} />
                </button>
            </form>

        </div>
    )
}

export default MessageInput