'use client'
import React from 'react'

const Connected = () => {
    return (
        <div id='Connected' className={`w-full  h-full  bg-blackish `}>
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[120px] pb-[59px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl py-12 flex flex-col justify-center items-center px-4'>
                    <h1 className='text-white text-[26px] font-bold leading-none mb-[41px] text-center'>Stay Connected with VRA</h1>
                    <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none mb-12 text-center'>Join Us and Unlock the Future of VRA</h1>
                    <span className='w-full border-b mb-6'></span>
                    <p className='text-white text-[20px] mb-11 font-semibold leading-none w-full max-w-xl text-center'>Subscribe to our newsletter to stay update on the latest in VRA technology,
                        exclusive offers, and new immersive experience.</p>
                    <div className='p-2.5 w-full max-w-[600px] h-20 rounded-full border-white border flex justify-between items-center'>
                        <input type="text" placeholder='Enter Your Email Address here' className='bg-transparent md:text-xl font-semibold placeholder:text-white pl-2 focus:outline-none max-w-[130px] sm:max-w-full ' />

                        <button className='py-4 px-4 transition-all ease-in-out hover:transition hover:-translate-y-1 hover:duration-500 md:px-8 bg-black text-white rounded-full -ml-20 sm:ml-0'>Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Connected
