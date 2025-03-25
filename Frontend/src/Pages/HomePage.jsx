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
        <div className='h-screen w-full'>
            <div className='flex justify-center pt-13 h-full w-full'>
                <div className='rounded-lg shadow-cl w-full h-full'>
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
