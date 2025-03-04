import React from 'react'
import { Link } from 'react-router'
import { useAuthStore } from '../lib/useAuthStore'
import ChatAppLogo from "../assets/ChatAppLogo.png"


import { IoSettings } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
function Navbar() {

    const { logout, authUser } = useAuthStore()

    return (
        <header
            className='fixed bg-transparent w-full top-0 z-40'
        >
            <div className='container mx-auto px-4 h-16'>
                <div className='flex items-center justify-between h-full'>
                    <Link to={`/home`} className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
                        <img src={ChatAppLogo} alt="App Logo" className='size-20' />
                        <h1 className='text-lg font-bold`'>BINGO</h1>
                    </Link>
                    <div className='flex items-center gap-5'>
                        <Link to={`/settings`}>
                            <IoSettings className='size-5 hover:animate-spin hover:size-7' />
                        </Link>
                        {authUser && (
                            <>
                                <Link to={`/profile`}>
                                    <FaUserCircle className='size-5 hover:animate-pulse hover:size-7' />
                                </Link>

                                <MdLogout className='size-5 hover:size-7' onClick={logout} />
                            </>
                        )}

                    </div>
                </div>


            </div>
        </header>
    )
}

export default Navbar
