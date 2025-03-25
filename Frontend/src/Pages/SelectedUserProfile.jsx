import React from 'react'
import { useChatStore } from '../lib/useChatStore'
import { useGroupStore } from '../lib/useGroupStore'
import { FaUser, FaUsers } from "react-icons/fa";
import { IoMail, IoCalendar } from 'react-icons/io5';

function ProfilePage() {
    const { selectedUser } = useChatStore();
    const { selectedGroup } = useGroupStore();
    
    const profileData = selectedGroup ? {
        type: 'group',
        name: selectedGroup.name,
        image: selectedGroup.profilePic || "/group-avatar.png",
        createdAt: selectedGroup.createdAt,
        members: selectedGroup.members || [],
        admin: selectedGroup.createdBy // This is a User reference
    } : {
        type: 'user',
        name: selectedUser?.fullName,
        image: selectedUser?.profilePic || "/Avatar.jpg",
        email: selectedUser?.email,
        createdAt: selectedUser?.createdAt
    };

    return (
        <div className='min-h-screen pt-20'>
            <div className='max-w-2xl mx-auto p-4 py-8 bg-white/20 backdrop-blur-md'>
                <div className='rounded-xl p-6 space-y-8'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-semibold'>Profile</h1>
                        <p className='mt-2'>
                            {selectedGroup ? "Group Profile Information" : "Your Profile Information"}
                        </p>
                    </div>
                    
                    <div className='flex justify-center items-center'>
                        <img src={profileData.image} alt='profile'
                            className={`size-32 rounded-full object-cover border-4 ${
                                selectedGroup ? 'border-blue-200' : 'border-purple-200'
                            }`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = selectedGroup ? "/group-avatar.png" : "/Avatar.jpg";
                            }}
                        />
                    </div>

                    <div className='space-y-6'>
                        <div className='space-y-1.5'>
                            <div className='text-sm text-[#444] flex items-center gap-2'>
                                {selectedGroup ? <FaUsers className='size-4' /> : <FaUser className='size-4' />}
                                {selectedGroup ? 'Group Name' : 'Full Name'}
                            </div>
                            <p className='px-4 py-2.5 rounded-lg border'>{profileData.name}</p>
                        </div>

                        {!selectedGroup && (
                            <div className='space-y-1.5'>
                                <div className='text-sm text-[#444] flex items-center gap-2'>
                                    <IoMail className='size-4' />
                                    Email Address
                                </div>
                                <p className='px-4 py-2.5 rounded-lg border'>{profileData.email}</p>
                            </div>
                        )}
                    </div>

                    <div className='mt-6 rounded-xl p-6'>
                        <h2 className='text-lg font-medium mb-4'>
                            {selectedGroup ? 'Group Information' : 'Account Information'}
                        </h2>
                        
                        <div className='space-y-3 text-sm'>
                            <div className='flex items-center justify-between py-2 border-b text-[#444]'>
                                <span className='flex items-center gap-2'>
                                    <IoCalendar className='size-4' />
                                    {selectedGroup ? 'Created On' : 'Member Since'}
                                </span>
                                <span>{new Date(profileData.createdAt).toLocaleDateString()}</span>
                            </div>

                            {selectedGroup ? (
                                <>
                                    <div className='flex items-center justify-between py-2 border-b text-[#444]'>
                                        <span>Admin</span>
                                        <span>{profileData.admin?.fullName || 'Unknown'}</span>
                                    </div>
                                    <div className='pt-4'>
                                        <h3 className='font-medium mb-2'>Group Members ({profileData.members.length})</h3>
                                        <div className='space-y-2'>
                                            {profileData.members?.map(member => (
                                                <div key={member._id} className='flex text-black items-center gap-3 p-2 bg-gray-50 rounded'>
                                                    <img 
                                                        src={member.profilePic || "/Avatar.jpg"} 
                                                        alt={member.fullName}
                                                        className='size-8 rounded-full'
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/Avatar.jpg";
                                                        }}
                                                    />
                                                    <span>{member.fullName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='flex items-center justify-between py-2'>
                                    <span>Account Status</span>
                                    <span className='text-green-800'>Active</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage