import React, { useRef, useState } from 'react'
import { useChatStore } from '../lib/useChatStore';
import { Image, Send, X } from 'lucide-react';
import { useGroupStore } from '../lib/useGroupStore';

function MessageInput() {

    const [text, setText] = useState("")
    const [previewImage, setPreviewImage] = useState(null)
    const fileInputRef = useRef(null);
    const { sendMessage, selectedUser } = useChatStore();
    const { sendGroupMessage, selectedGroup } = useGroupStore();

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
        if (selectedGroup && !selectedUser) {
            if (!text.trim() && !previewImage) return;
            try {
                await sendGroupMessage({
                    text: text.trim(),
                    image: previewImage,
                })
                setText("");
                setPreviewImage(null)
                if (fileInputRef.current) fileInputRef.current.value = "";
            } catch (error) {
                console.log("Failed to send Message:", error);

            }
        }
        if (selectedUser && !selectedGroup) {
            if (!text.trim() && !previewImage) return;
            try {
                await sendMessage({
                    text: text.trim(),
                    image: previewImage,
                })
                setText("");
                setPreviewImage(null)
                if (fileInputRef.current) fileInputRef.current.value = "";
            } catch (error) {
                console.log("Failed to send Message:", error);

            }
        }
    }


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