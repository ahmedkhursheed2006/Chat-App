import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useGroupStore } from '../lib/useGroupStore';
import { MdFileCopy } from "react-icons/md";
import { useChatStore } from '../lib/useChatStore';
import { FaCamera } from 'react-icons/fa';
import { useAuthStore } from '../lib/useAuthStore';
import toast from 'react-hot-toast';
function GroupCard() {
    const { users } = useChatStore();
    const { authUser } = useAuthStore();
    const { setGroupCardOpen, createGroup } = useGroupStore();
    const [selectedUsers, setSelectedUsers] = useState([authUser._id]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({ groupName: "", profilePic: "", createdBy: authUser.fullName });
    const validateForm = () => {
        if (!formData.groupName.trim()) return toast.error("Group Name is required!");
        return true;
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const newGroup = {
        name: formData.groupName,
        members: selectedUsers,
        createdBy: authUser._id,
        profilePic: selectedImage || null,
    };
    try {
        const response = await fetch("http://localhost:5000/api/groups/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newGroup),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to create group");
        }
        toast.success("Group Created Successfully!");
    } catch (error) {
        toast.error(error.message);
    }
};
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
            setFormData((prev) => ({ ...prev, profilePic: base64Image }));
        };
    };
    const handleSelectUser = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId] // Add if not selected
        );
    };
    return (
        <div className='size-130 left-[33%] absolute z-10 bg-white rounded-xl text-black flex justify-center items-center border-2 border-[#ccc]'>
            <div className='w-9/10 h-9/10 flex flex-col gap-5'>
                {/* Header */}
                <div className='text-center my-2'>
                    <p className='text-[#444] text-4xl'>Create a Group</p>
                    <button onClick={() => setGroupCardOpen(null)} className="cursor-pointer right-0 top-0 absolute m-1 text-[#444]">
                        <X />
                    </button>
                </div>
                {/* Form */}
                <form className='h-full flex flex-col gap-3 justify-between' onSubmit={handleSubmit}>
                    <div>
                        <div className='flex items-center justify-center gap-5'>
                            <div className='relative size-15 bg-[#ccc] rounded-full flex items-center justify-center'>
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Group" className='size-15 object-cover rounded-full' />
                                ) : (
                                    <MdFileCopy className='size-12' />
                                )}
                                <label htmlFor="avatar-upload">
                                    <FaCamera className='size-5 bg-[#ccc] absolute bottom-0 right-0 hover:scale-105 rounded-full cursor-pointer transition-all duration-200' />
                                    <input type="file" id='avatar-upload' className='hidden' accept='image/*' onChange={handleImageUpload} />
                                </label>
                            </div>
                            <input
                                type="text"
                                placeholder='Group Name'
                                className='border-dotted border-b-2 border-[#ccc] outline-none'
                                value={formData.groupName}
                                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                                required
                            />
                        </div>
                        {/* User selection */}
                        <div className='overflow-y-auto w-full py-3 no-scrollbar'>
                            {users.map((user) => (
                                <button
                                    key={user._id}
                                    className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors justify-between`}
                                    type="button"
                                >
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='flex items-center gap-3'>
                                            <img src={user.profilePic || "/Avatar.jpg"} alt={user.name} className='size-12 object-cover rounded-full' />
                                            <div className='font-medium truncate'>{user.fullName}</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className='size-5 '
                                            checked={selectedUsers.includes(user._id)}
                                            onChange={() => handleSelectUser(user._id)}
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Submit Button */}
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
    );
}
export default GroupCard;