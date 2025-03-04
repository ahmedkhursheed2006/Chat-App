import React, { useState } from 'react'
import { Link } from 'react-router';

import { FaUser } from 'react-icons/fa'
import { IoMail, IoEye } from "react-icons/io5";

import ChatAppLogo from "../assets/ChatAppLogo.png"
import { useAuthStore } from '../lib/useAuthStore';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({  fullName: '', email: '', password: '' })
    const {signup , isSigningUp} = useAuthStore()

    const validateForm = () =>{
        if (!formData.fullName.trim()) return toast.error("Full Name is Required!");
        if (!formData.email.trim()) return toast.error("Email is Required!");
        if (!formData.password) return toast.error("Password is Required!");

        
        if (formData.password.length < 6) return toast.error("Password Must Be More than 6 Characters!");

        return true
    }
    const handleSubmit = (e) =>{
        e.preventDefault();

        const success = validateForm()
        
        if (success === true) signup(formData);

    }
    
    return (
        <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-[#4ffbec] to-[#d83bfc]">
            
                <div className="h-full w-full p-6 flex flex-col justify-center items-center">
                    <div className='w-1/2 flex flex-col justify-center'>
                        <h2 className="text-6xl font-semibold text-center">Sign Up</h2>
                        <form onSubmit={handleSubmit} className="h-full mt-6 space-y-6">
                            <div className='relative flex justify-end items-center my-[45px] bg-white rounded-sm '>
                                <input 
                                className="w-full px-4 py-2 rounded-lg outline-0" 
                                type="text" 
                                id="name" 
                                placeholder='Name'
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData , fullName: e.target.value})} />
                                <FaUser className='absolute text-[1.2rem] mx-3 text-[#888] ' />
                            </div>
                            <div className='relative flex justify-end items-center my-[45px] bg-white rounded-sm '>
                                <input 
                                className="w-full px-4 py-2  rounded-lg outline-0" 
                                type="email" 
                                id="email" 
                                placeholder='Email'
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData , email: e.target.value})} />
                                <IoMail className='absolute text-[1.2rem] mx-3 text-[#888]' />
                            </div>
                            <div className={`relative flex justify-end items-center my-[45px] bg-white rounded-sm `}>
                                <input 
                                className="w-full px-4 py-2 rounded-lg outline-0" 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                placeholder='Password'
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData , password: e.target.value})} />
                                <IoEye className='absolute text-[1.2rem] mx-3 text-[#888] cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                            </div>
                            <div className='relative flex justify-end items-center mt-[45px]'>
                                <button className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg cursor-pointer" 
                                type="submit"
                                disabled={isSigningUp}>
                                {
                                    isSigningUp?
                                    (<>
                                        <Loader2 className='size-5 animate-spin'/>
                                        Loading...
                                    </>
                                    ):(
                                        "Create Account"
                                    )
                                }
                                
                                
                                </button>
                            </div>
                        </form>
                            <Link to={`/login`} className='text-center text-sm text-[#363636] hover:underline my-2'>Have an Account? Login!</Link>
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
