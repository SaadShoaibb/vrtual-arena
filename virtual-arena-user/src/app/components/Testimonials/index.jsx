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

                    <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 mt-16'>
                        <div className='lg:col-span-2 xl:col-span-1 flex flex-col justify-between gap-8'>
                            <div className='flex items-center gap-4'>
                                <img src="assets/user.png" alt="User" className="w-16 h-16 object-cover rounded-full" />
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 text-[#FFA600]'>
                                        <FaStar size={20} />
                                        <FaStar size={20} />
                                        <FaStar size={20} />
                                        <FaStar size={20} />
                                        <FaStar size={20} />
                                    </div>
                                    <h1 className='text-white font-semibold'>15k+ Reviews</h1>
                                </div>
                            </div>

                            <div className='flex items-center gap-5'>
                                <button className="hover:opacity-80 transition-opacity">
                                    <img src="/icons/left.png" alt="Previous" className="w-12 h-12" />
                                </button>
                                <button className="hover:opacity-80 transition-opacity">
                                    <img src="/icons/right.png" alt="Next" className="w-12 h-12" />
                                </button>
                            </div>
                        </div>

                        <div className='lg:col-span-3 xl:col-span-2 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl p-6 md:p-8'>
                            <div className='flex flex-col md:flex-row gap-6 md:gap-8'>
                                <img 
                                    src="assets/user.png" 
                                    alt="Esther Howard" 
                                    className='w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white object-cover'
                                />
                                <div className='flex-1'>
                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4'>
                                        <div>
                                            <div className='flex gap-1 text-[#FFA600] mb-2'>
                                                <FaStar size={20} />
                                                <FaStar size={20} />
                                                <FaStar size={20} />
                                                <FaStar size={20} />
                                                <FaStar size={20} />
                                            </div>
                                            <h1 className='text-2xl md:text-3xl text-white font-bold'>Esther Howard</h1>
                                            <h3 className='text-white text-lg'>Client Feedback</h3>
                                        </div>
                                        <img src="/icons/comma.png" alt="Quote" className='w-12 h-12' />
                                    </div>
                                    <p className='text-base md:text-lg font-light text-white'>
                                        "The VR experience at VRA was absolutely mind-blowing! The equipment was top-notch, the staff were super helpful, and I felt like I was really inside the game. Will definitely be back with friends!"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='hidden xl:block col-span-2 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl p-8'>
                            <div className='flex gap-8'>
                                <img 
                                    src="assets/user.png" 
                                    alt="Michael Lee" 
                                    className='w-24 h-24 rounded-full border-2 border-white object-cover'
                                />
                                <div className='flex-1'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <div>
                                            <div className='flex gap-1 text-[#FFA600] mb-2'>
                                                <FaStar size={20} />
                                                <FaStar size={20} />
                                                <FaStar size={20} />
                                                <FaStar size={20} />
                                                <FaStar size={20} />
                                            </div>
                                            <h1 className='text-3xl text-white font-bold'>Michael Lee</h1>
                                            <h3 className='text-white text-lg'>Client Feedback</h3>
                                        </div>
                                        <img src="/icons/comma.png" alt="Quote" className='w-12 h-12' />
                                    </div>
                                    <p className='text-lg font-light text-white'>
                                        "I hosted my son's birthday party at VRA and it was a total hit. The kids had a blast, and everything was perfectly organized. Thank you for making it so special!"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Testimonials
