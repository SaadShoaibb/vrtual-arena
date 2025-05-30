'use client'
import React from 'react'

const Contact = () => {
    return (
        <div id='contact' className={`w-full  h-full  bg-blackish `}>
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[91px] pb-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 '>
                    <div className='w-full'>

                        <h1 className='text-gradiant text-[26px] font-semibold '>Contact Us</h1>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold  leading-none'>Get In Touch</h1>
                       
                        <p className='text-white text-lg  font-light max-w-[720px] mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                        <h1 className=' text-[30px] font-bold text-white  mt-9'>7 AM - 5 PM, Mon - Sat</h1>
                        <p className='text-white text-lg  font-light leading-none mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus luctus nec.</p>
                        
                    </div>

                    <div>
         

                        <form className="mt-6">
                            {/* First Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <input
                                    type="text"
                                    placeholder="First Name*"
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name*"
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                />
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <input
                                    type="email"
                                    placeholder="Email Address*"
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number*"
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                />
                            </div>

                            {/* Message Field */}
                            <textarea
                                placeholder="Message*"
                                className="w-full border mb-6 bg-transparent text-white focus:outline-none p-5 rounded-xl h-[220px] resize-none "
                            ></textarea>

                            <input type="checkbox" name="" id="" className='h-[22px] w-[22px] bg-transparent text-white checked:bg-transparent checked:text-white border border-white' />
                            <span className='text-xl font-light text-white ml-2 '>I accept <span className='text-[26px] font-semibold'>terms and conditions</span></span>

                            {/* Send Message Button */}
                            <button className=' col-span-5 lg:col-span-2 xl:col-span-1 text-xl mt-[45px]  font-semibold flex items-center h-fit w-fit  my-auto py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Send Message <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Contact
