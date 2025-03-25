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
            className='fixed bg-transparent backdrop-blur-lg w-full top-0 z-40 py-1'
        >
            <div className='container mx-auto px-4 h-10'>
                <div className='flex items-center justify-between h-full'>
                    <Link to={`/`} className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
                        <img src={ChatAppLogo} alt="App Logo" className='size-15' />
                        <h1 className='text-lg font-bold`'>BINGO</h1>
                    </Link>
                    <div className='flex items-center gap-5'>
                       
                        {authUser && (
                            <>
                                <Link to={`/profile`}>
                                    <FaUserCircle className='size-5 hover:animate-pulse hover:size-7' />
                                </Link>

                                <Link to={`/login`}><MdLogout className='size-5 hover:size-7' onClick={logout} /></Link>
                            </>
                        )}

                    </div>
                </div>


            </div>
        </header>
    )
}

export default Navbar
