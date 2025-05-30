'use client'
import React from 'react'

const HeroHeader = ({btn, title, bg}) => {
    return (
        <div className="h-[700px] overflow-x-hidden relative -mt-[90px] md:-mt-[110px]">

            <div className="absolute inset-0 z-0 bg-black bg-gradient-to-tr from-[#00000000] to-[#00000080] bg-opacity-50"></div>
            <img src="/assets/header.png" alt="" className='absolute z-0 top-0 w-full h-full' />
            <img src="/assets/header2.png" alt="" className='absolute z-0 top-0 w-full h-full' />

            <div className={`${bg} bg-center bg-no-repeat bg-cover h-[700px] overflow-hidden`}>
                <div id='home' className={`relative w-full h-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6`}>
                    <div className='w-full max-w-[1087px] mx-auto h-full'>
                        <div className='flex flex-col w-full h-full justify-center items-center mt-16 md:items-start'>
                            <button className='bg-white text-black px-6 py-2.5 mx-auto leading-none text-xl font-semibold rounded-xl mb-5'>
                                {btn}
                            </button>
                            <h1 className='text-white text-[50px] mb-6 w-full md:text-[80px] lg:text-[100px] leading-none font-bold text-center text-wrap'>{title}</h1>

                            <p className='text-white text-center w-full mt-2.5 text-xl'>
                                Discover unbeatable offers, premium features, and tailored services designed to elevate your experience. Whether you're exploring, connecting, or upgrading—you're in the right place.
                            </p>
                            <div className='flex flex-col md:flex-row items-center mt-6 gap-3 w-full justify-center'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HeroHeader
