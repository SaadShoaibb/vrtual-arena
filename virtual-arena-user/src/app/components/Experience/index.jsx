'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const Experience = () => {
    const router = useRouter()

    return (
        <div id='experience' className={`w-full h-full bg-blackish`}>
            <div className='w-full mx-auto max-w-[1600px] border-b py-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-4'>
                    <div>
                        <h1 className='text-gradiant text-[26px] font-semibold'>Experiences</h1>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none'>
                            Our Gaming Experiences by Category
                        </h1>
                    </div>
                    <div>
                        <p className='text-xl text-white font-light'>
                            Dive into a wide variety of immersive VR games—from intense action and exploration to fun family-friendly adventures. Our curated categories ensure there's something exciting for everyone at Vrtual Arena.
                        </p>
                        <button
                            onClick={() => router.push('/experiences')}
                            className="text-xl mt-4 hover:-translate-y-1 hover:transition hover:duration-500 font-semibold flex items-center text-nowrap py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]"
                        >
                            Explore Experiences
                            <img
                                src="/icons/arrow.svg"
                                alt=""
                                className="h-[22px] w-[22px] ml-[11px] rounded-full"
                            />
                        </button>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-[60px]'>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='grid grid-flow-col grid-rows-2 gap-4 w-full'>
                            <div className='bg-[#23A1FF] w-full max-w-[240px] rounded-xl flex justify-center items-center h-[200px]'>
                                <img src="/icons/exp1.png" alt="" />
                            </div>
                            <div className='bg-[#DB1FEB] w-full max-w-[240px] rounded-xl flex justify-center items-center h-[200px]'>
                                <div>
                                    <h1 className='text-white text-[45px] md:text-[60px] font-bold leading-none'>96k</h1>
                                    <h1 className='text-white text-[30px] font-semibold leading-none'>HAPPY<br /> CLIENTS</h1>
                                </div>
                            </div>
                            <img src="/assets/experience1.png" alt="" className='row-span-2 object-cover w-full max-w-[240px] h-full' />
                        </div>
                        <div className='flex justify-center items-center gap-4 bg-[#23A1FF] rounded-xl h-[200px]'>
                            <img src="/icons/exp2.png" alt="" />
                            <div>
                                <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none'>150k</h1>
                                <h1 className='text-white text-[24px] md:text-[30px] font-semibold leading-none'>PRODUCTS SOLD</h1>
                            </div>
                        </div>
                    </div>

                    <img src="/assets/experience2.png" className='rounded-xl object-cover h-full' alt="" />

                    <div className='flex flex-col gap-4 w-full'>
                        <div className='flex justify-center items-center gap-4 bg-[#23A1FF] rounded-xl h-[200px]'>
                            <img src="/icons/exp2.png" alt="" />
                            <div>
                                <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none'>56k</h1>
                                <h1 className='text-white text-[24px] md:text-[30px] font-semibold leading-none'>POPULAR<br /> FEATURES</h1>
                            </div>
                        </div>
                        <div className='grid grid-flow-col grid-rows-2 gap-4 w-full'>
                            <img src="/assets/experience3.png" alt="" className='row-span-2 object-cover h-full w-full max-w-[240px]' />
                            <div className='bg-[#DB1FEB] w-full max-w-[240px] rounded-xl flex justify-center items-center h-[200px]'>
                                <div>
                                    <h1 className='text-white text-[45px] md:text-[60px] font-bold leading-none'>45k</h1>
                                    <h1 className='text-white text-[24px] md:text-[30px] font-semibold leading-none'>COUNTRIES<br /> SERVED</h1>
                                </div>
                            </div>
                            <div className='bg-[#23A1FF] w-full max-w-[240px] rounded-xl flex justify-center items-center h-[200px]'>
                                <img src="/icons/exp1.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Experience
