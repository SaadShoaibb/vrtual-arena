'use client'
import React from 'react'
import { FaStar } from 'react-icons/fa'

const Testimonials = () => {
    return (
        <>
            <div id='tesimonials' className='w-full h-full bg-blackish'>
                <div className='w-full mx-auto max-w-[1600px] border-y py-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-center'>
                        <div className='w-full border-r-2 border-[#926BB9]'>
                            <h1 className='text-gradiant text-[26px] font-semibold'>Testimonial</h1>
                            <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none'>
                                What Our Awesome Customers Say
                            </h1>
                        </div>
                        <div>
                            <p className='text-xl text-white font-light'>
                                Our players love the thrill of the Virtual Arena! From immersive VR battles to unforgettable group sessions, the feedback speaks for itself. Discover what keeps them coming back for more.
                            </p>
                        </div>
                    </div>

                    <div className='grid grid-cols-5 gap-8 xl:gap-24 mt-16 pl-16'>
                        <div className='col-span-5 lg:col-span-2 xl:col-span-1 -ml-16 md:ml-0 flex flex-col justify-between'>
                            <div className='flex items-center gap-2'>
                                <img src="assets/user.png" alt="User" />
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 text-[#FFA600]'>
                                        <FaStar size={26} />
                                        <FaStar size={26} />
                                        <FaStar size={26} />
                                        <FaStar size={26} />
                                        <FaStar size={26} />
                                    </div>
                                    <h1 className='text-white font-semibold'>15k+ Reviews</h1>
                                </div>
                            </div>

                            <div className='flex items-center gap-5'>
                                <img src="/icons/left.png" alt="Previous" />
                                <img src="/icons/right.png" alt="Next" />
                            </div>
                        </div>

                        <div className='col-span-5 lg:col-span-3 xl:col-span-2 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl flex gap-4 md:gap-7 h-[280px]'>
                            <img src="assets/user.png" alt="Esther Howard" className='border -ml-12 md:-ml-16 border-white h-20 md:h-[120px] w-20 md:w-[120px] my-auto rounded-full' />
                            <div className='my-auto pr-6'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex flex-col gap-1'>
                                        <div className='flex gap-2 text-[#FFA600] -ml-6 md:ml-0'>
                                            <FaStar size={26} />
                                            <FaStar size={26} />
                                            <FaStar size={26} />
                                            <FaStar size={26} />
                                            <FaStar size={26} />
                                        </div>
                                        <h1 className='text-[24px] md:text-[30px] -ml-6 md:ml-0 text-white font-bold'>Esther Howard</h1>
                                        <h3 className='text-white text-lg'>Client Feedback</h3>
                                    </div>
                                    <img src="/icons/comma.png" alt="Quote" className='-ml-6 md:ml-0' />
                                </div>
                                <p className='text-sm md:text-lg font-light text-white'>
                                    “The VR experience at VRA was absolutely mind-blowing! The equipment was top-notch, the staff were super helpful, and I felt like I was really inside the game. Will definitely be back with friends!”
                                </p>
                            </div>
                        </div>

                        <div className='hidden col-span-2 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl xl:flex gap-7 h-[280px]'>
                            <img src="assets/user.png" alt="Esther Howard" className='border rounded-full -ml-16 border-white h-[120px] w-[120px] my-auto' />
                            <div className='my-auto pr-6'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex flex-col gap-1'>
                                        <div className='flex gap-2 text-[#FFA600]'>
                                            <FaStar size={26} />
                                            <FaStar size={26} />
                                            <FaStar size={26} />
                                            <FaStar size={26} />
                                            <FaStar size={26} />
                                        </div>
                                        <h1 className='text-[30px] text-white font-bold'>Michael Lee</h1>
                                        <h3 className='text-white text-lg'>Client Feedback</h3>
                                    </div>
                                    <img src="/icons/comma.png" alt="Quote" />
                                </div>
                                <p className='text-lg font-light text-white'>
                                    “I hosted my son's birthday party at VRA and it was a total hit. The kids had a blast, and everything was perfectly organized. Thank you for making it so special!”
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Testimonials
