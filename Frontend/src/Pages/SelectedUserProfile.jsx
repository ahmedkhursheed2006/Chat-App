import React from 'react'
import { useChatStore } from '../lib/useChatStore'
import { FaUser } from "react-icons/fa";
import { IoMail } from 'react-icons/io5';



function ProfilePage() {

    const { selectedUser, setSelectedUser } = useChatStore();

    return (
        <div className='min-h-screen pt-20'>
            <div className='max-w-2xl mx-auto p-4 py-8 bg-white/20 backdrop-blur-md'>
                <div className=' rounded-xl p-6 space-y-8'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-semibold'>Profile</h1>
                        <p className='mt-2'>Your Profile Information</p>
                    </div>
                    <div className='flex justify-center items-center'>
                        <img src={selectedUser.profilePic || "/Avatar.jpg"} alt='profile'
                            className='size-32 rounded-full object-cover border-4' />
                    </div>
                    <div className='space-y-6'>
                        <div className='space-y-1.5'>
                            <div className='text-sm text-[#444] flex items-center gap-2'>
                                <FaUser className='size-4' />
                                Full Name
                            </div>
                            <p className='px-4 py-2.5 rounded-lg border'>{selectedUser?.fullName}</p>
                        </div>
                        <div className='space-y-1.5'>
                            <div className='text-sm text-[#444] flex items-center gap-2'>
                                <IoMail className='size-4' />
                                Email Address
                            </div>
                            <p className='px-4 py-2.5 rounded-lg border'>{selectedUser?.email}</p>
                        </div>
                    </div>
                    <div className='mt-6 rounded-xl p-6'>
                        <h2 className='text-lg font-medium mb-4'>Account Information</h2>
                        <div className='space-y-3 text-sm'>
                            <div className='flex items-center justify-between py-2 border-b text-[#444]'>
                                <span>Member Since</span>
                                <span>{selectedUser.createdAt?.split("T")[0]}</span>
                            </div>
                            <div className='flex items-center justify-between py-2'>
                                <span>Account Status</span>
                                <span className='text-green-800'>Active</span>
                            </div>

                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default ProfilePage

