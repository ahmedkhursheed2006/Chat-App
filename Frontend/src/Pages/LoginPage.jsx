import React, { useState } from 'react'
import { Link } from 'react-router';


import { IoMail, IoEye } from "react-icons/io5";
import { Loader2 } from 'lucide-react';

import ChatAppLogo from "../assets/ChatAppLogo.png"
import { useAuthStore } from '../lib/useAuthStore';



export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const { login , isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-[#4ffbec] to-[#d83bfc]">

            <div className="h-full w-full p-6 flex flex-col justify-center items-center">
                <div className='w-1/2 flex flex-col justify-center'>
                    <h2 className="text-6xl font-semibold text-center">Login</h2>
                    <form onSubmit={handleSubmit} className="h-full mt-6 space-y-6 text-center">
                        <div className='relative flex justify-end items-center my-[45px] bg-white rounded-sm '>
                            <input
                                className="w-full px-4 py-2  rounded-lg outline-0"
                                type="email"
                                id="email"
                                placeholder='Email'
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            <IoMail className='absolute text-[1.2rem] mx-3 text-[#888]' />
                        </div>
                        <div className={`relative flex justify-end items-center my-[45px] bg-white rounded-sm `}>
                            <input
                                className="w-full px-4 py-2 rounded-lg outline-0"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder='Password'
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            <IoEye className='absolute text-[1.2rem] mx-3 text-[#888] cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                        </div>
                        <div className='relative flex justify-end items-center mt-[45px]'>
                            <button className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg cursor-pointer"
                                type="submit"
                                disabled={isLoggingIn}>
                                {
                                    isLoggingIn ?
                                        (<>
                                            <Loader2 className='size-5 animate-spin' />
                                            Loading...
                                        </>
                                        ) : (
                                            "Login Account"
                                        )
                                }


                            </button>
                        </div>
                        <Link to={`/signup`} className='text-center text-sm text-[#363636] hover:underline'>Don't Have an Account? Register!</Link>
                    </form>
                </div>

            </div>



            <div className=' bg-inherit w-full h-full'>
                <div className='flex flex-col items-center justify-center h-full'>
                    <img src={ChatAppLogo} alt="App Logo" className='animate-[pulse_3s_ease-in-out_infinite]' />
                </div>
            </div>

        </div>

    )
}
