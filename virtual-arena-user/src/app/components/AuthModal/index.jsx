'use client'
import React from 'react'
import { FaArrowLeft, FaMinus } from 'react-icons/fa';
const AuthModel = ({ children, onClose }) => {
    return (
        <>
            <div className="fixed h-screen flex justify-center w-screen top-0 items-center z-[1001]">
                <div onClick={onClose} className="absolute inset-0 z-0 bg-black bg-opacity-50"></div>
                <div className='flex flex-col items-center md:mx-10 pt-16 pb-12 px-2 md:px-6 max-h-[90vh] overflow-auto w-full max-w-[700px] rounded-2xl bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] relative'>
                    <div onClick={onClose} className='cursor-pointer h-[50px] w-[50px] text-white rounded-full bg-[#47B0FF] flex justify-center items-center absolute md:top-[45px] md:left-[30px] top-6 left-6'>
                        <FaArrowLeft />
                    </div>
                    <div onClick={onClose} className='cursor-pointer h-[50px] w-[50px] rounded-full bg-[#47B0FF] text-white flex justify-center items-center absolute md:top-[45px] md:right-[30px] top-6 right-6'>
                        <FaMinus />
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}

export default AuthModel