import React from 'react';
import { useChatStore } from '../lib/useChatStore';
import { useGroupStore } from '../lib/useGroupStore';

import SideBar from "../Components/SideBar";
import NoChatSelected from '../Components/NoChatSelected';
import ChatContainer from '../Components/ChatContainer';

function HomePage() {
    const { selectedUser } = useChatStore();
    const { selectedGroup } = useGroupStore();


    return (
        <div className='h-screen'>
            <div className='flex items-center justify-center pt-20 px-4 h-full'>
                <div className='rounded-lg shadow-cl w-full max-w-6xl h-full'>
                    <div className='flex h-full rounded-lg overflow-hidden gap-1'>
                        <SideBar />

                        
                        {!selectedGroup && !selectedUser ? (
                            <NoChatSelected />
                        ) : (
                            
                            <ChatContainer 
                                
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
