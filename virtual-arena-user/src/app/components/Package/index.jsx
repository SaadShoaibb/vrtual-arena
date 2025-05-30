'use client'
import Link from 'next/link'
import React from 'react'

const Package = () => {
    return (
        <>
            <div className='w-full bg-blackish h-[197px] overflow-hidden'></div>

            <div id='package' className='w-full min-h-[450px] bg-package bg-no-repeat bg-center relative'>
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#003C66] to-[#580060] bg-opacity-70"></div>

                <div className='w-full mx-auto max-w-[1600px] py-[100px] flex items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6 relative z-10'>

                    <div className='w-full max-w-[858px]'>
                        <h3 className='text-white text-[26px] md:text-[30px]'>Ready to Dive In?</h3>
                        <h1 className='text-white text-[50px] md:text-[60px] mt-3 font-bold leading-tight'>
                            Let's Get Started
                        </h1>
                        <p className='text-[18px] text-white mt-4'>
                            Whether you're a gamer, developer, or business innovator — our immersive VR packages are built to accelerate your experience. Choose the one that fits you best and get started today.
                        </p>
                        <Link href={'/deals'}>
                            <button className='text-xl mt-5 font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>
                                Explore VR Packages
                                <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' />
                            </button>
                        </Link>
                    </div>

                    <img
                        src="/assets/pkg2.png"
                        alt="VR Package Illustration"
                        className='absolute right-[5%] max-h-[547px] bottom-0 object-contain hidden md:block'
                    />
                </div>
            </div>
        </>
    )
}

export default Package
