import React from 'react'
import { MessageSquare } from "lucide-react"

function NoChatSelected() {
    return (
        <div className='w-full flex flex-1 flex-col items-center justify-centerp-16'>
            <div className='max-w-md text-center space-y-6'>
                <div className='flex justify-center space-y-6'>
                    <div className='relative'>
                        <div className='size-16 rounded-2xl flex items-center justify-center animate-bounce'>
                            <MessageSquare className='size-8' />
                        </div>
                    </div>
                </div>
                <h2 className='text-2xl font-bold'>Welcome to Bingo!</h2>
                <p className='text-base-content/60'>Select a Conversation from the sidebar to start Chatting</p>
            </div>
        </div>
    )
}

export default NoChatSelected
