'use client'
import React from 'react'

const Contact = () => {
    return (
        <div id='contact' className={`w-full  h-full  bg-blackish `}>
            <div className='w-full mx-auto max-w-[1600px] border-y py-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-center'>
                    <div className='w-full'>

                        <h1 className='text-gradiant text-[26px] font-semibold '>Contact Us</h1>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold  leading-none'>Get In Touch</h1>
                        <h1 className=' text-[30px] text-white  mt-8'>Phone Number</h1>
                        <h1 className='text-white text-lg  font-light leading-none'>+12013893990</h1>
                        <h1 className=' text-[30px] text-white  mt-6'>Email Address</h1>
                        <h1 className='text-white text-lg  font-light leading-none'>Mohamadghazoul@gmail.com</h1>
                        <h1 className=' text-[30px] text-white  mt-6'>Location</h1>
                        <h1 className='text-white text-lg  font-light leading-none'>187 Franklin Turnpike, Ho-Ho-Kus, NJ 07423, United States</h1>
                    </div>

                    <div>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold  leading-none'>We’d Love To Hear
                            From You</h1>
                        <h1 className=' text-[20px] text-white  mt-6'>Fill out the form below, and we’ll get back to you at the earliest possible.</h1>

                        <form className="space-y-6 mt-6">
                            {/* First Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="First Name*"
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name*"
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                />
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="email"
                                    placeholder="Email Address*"
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number*"
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                />
                            </div>

                            {/* Message Field */}
                            <textarea
                                placeholder="Write a Message*"
                                className="w-full border-b  bg-transparent text-white focus:outline-none py-2 h-20 resize-none "
                            ></textarea>

                            {/* Send Message Button */}
                            <button className='hover:transition hover:-translate-y-1 hover:duration-500 col-span-5 lg:col-span-2 xl:col-span-1 text-xl mt-[60px]  font-semibold flex items-center h-fit w-fit  my-auto py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Send Message <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Contact
