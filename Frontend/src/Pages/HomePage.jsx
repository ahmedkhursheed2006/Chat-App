import React from 'react'
import { useChatStore } from '../lib/useChatStore';

import SideBar from "../Components/SideBar"
import NoChatSelected from '../Components/NoChatSelected';
import ChatContainer from '../Components/ChatContainer'


function HomePage() {
    const {selectedUser} = useChatStore();
    
    return (
        <div className='h-screen bg-gradient-to-br from-[#4ffbec] to-[#d83bfc]'>
          <div className='flex items-center justify-center pt-20 px-4 h-full'>
            <div className='rounded-lg shadow-cl w-full max-w-6xl h-full'>
              <div className='flex h-full rounded-lg overflow-hidden'>
                <SideBar/>
                {!selectedUser? <NoChatSelected/> : <ChatContainer/>}
              </div>
            </div>
          </div>
        </div>
    )
}

export default HomePage
