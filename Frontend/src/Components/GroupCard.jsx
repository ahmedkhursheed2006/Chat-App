import { X } from 'lucide-react'
import React, { useState } from 'react'
import { useGroupStore } from '../lib/useGroupStore';
import { MdFileCopy } from "react-icons/md";
import { useChatStore } from '../lib/useChatStore';
import { MdGroups } from "react-icons/md";

import { FaCamera } from 'react-icons/fa';
import { useAuthStore } from '../lib/useAuthStore';

function GroupCard() {

    const { users } = useChatStore();
    const { authUser } = useAuthStore();
    const { setGroupCardOpen, groupMembers, createGroup } = useGroupStore();
    const [selectedUsers, setSelectedUsers] = useState([authUser._id, ]);
    const [selectedImage, setSelectedIamge] = useState(null)
    const [formData, setFormData] = useState({ groupName: "", groupPic: "", createdBy: authUser.fullName, });

    const validateForm = () => {
        if (!formData.groupName.trim()) return toast.error("Full Name is Required!");


        return true
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateForm()
        const newGroup = {
            ...formData,
            members: selectedUsers, // Add selected users
        };

        if (success === true) createGroup(newGroup);
        console.log("🚀 Sending data to backend:", newGroup);

    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedIamge(base64Image)
            await updateProfile({ profilePic: base64Image })
        }
    }



    // Handle checkbox toggle
    const handleSelectUser = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId) // Remove if already selected
                : [...prev, userId], // Add if not selected
        );
        
    };
    return (
        <div className='size-130 left-[33%] absolute z-10 bg-white rounded-xl text-black flex justify-center items-center border-2 border-[#ccc]'>
            <div className='w-9/10 h-9/10 flex flex-col gap-5'>
                <div className='text-center my-2'>
                    <p className='text-[#444] text-4xl'>Create a Group</p>
                    <button onClick={() => setGroupCardOpen(null)} className="cursor-pointer right-0 top-0 absolute m-1 text-[#444]">
                        <X />
                    </button>
                </div>
                <form className='h-full flex flex-col gap-3 justify-between' onSubmit={handleSubmit}>
                    <div>
                        <div className='flex items-center justify-center gap-5'>
                            <div className='relative size-15 bg-[#ccc] rounded-full flex items-center justify-center'>
                                <MdFileCopy className='size-12' />
                                <label htmlFor="avatar-upload"
                                >
                                    <FaCamera className='size-5 bg-[#ccc] absolute bottom-0 right-0 hover:scale-105 rounded-full cursor-pointer transition-all duration-200' />
                                    <input type="file" id='avatar-upload' className='hidden' accept='image/*' onChange={handleImageUpload} />
                                </label>
                            </div>
                            <input type="text" placeholder='Group Name' className='border-dotted border-b-2 border-[#ccc] outline-none' value={formData.groupName} onChange={(e) => setFormData({ ...formData, groupName: e.target.value })} required />
                        </div>
                        <div className='overflow-y-auto w-full py-3 no-scrollbar'>
                            {users.map((user) => (
                                <button
                                    key={user._id}
                                    className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                            justify-between`}
                                >
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='flex items-center gap-3'>
                                            <img src={user.profilePic || "/Avatar.jpg"} alt={user.name} className='size-12 object-cover rounded-full' />
                                            <div className='font-medium truncate'>{user.fullName}</div>
                                        </div>
                                        <input type="checkbox" className='size-5 ' checked={selectedUsers.includes(user._id)}
                                            onChange={() => handleSelectUser(user._id)} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    {selectedUsers.length >= 2 && (
                        <button
                            type="submit"
                            className='mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
                        >
                            Create Group
                        </button>
                    )}
                </form>
            </div>

        </div>
    )
}

export default GroupCard
