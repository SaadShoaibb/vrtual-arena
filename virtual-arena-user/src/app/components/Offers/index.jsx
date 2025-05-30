'use client'
import Link from 'next/link'
import React from 'react'

const Offers = () => {
    return (
        <div id='offers' className={`w-full  h-full  bg-blackish`}>
            <div className='w-full mx-auto max-w-[1600px] border-b py-[100px]  flex justify-between items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 w-full'>
                    <div className='flex flex-col gap-2 sm:gap-5'>
                        <div className='bg-cardbg bg-no-repeat bg-cover w-full h-[260px] rounded-xl px-[30px] py-[27px] flex flex-col justify-between '>
                            <div>
                                <h1 className='text-white font-bold text-[40px] md:text-[50px] leading-none'>Visa Card Offer</h1>
                                <p className='text-[26px] text-white font-semibold mt-0.5 leading-none'>200 off on Order of $500</p>
                            </div>
                            <Link href={'/deals'}>
                            <button className='text-xl font-semibold w-fit flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                            </Link>
                        </div>
                        <div className='relative  w-full h-[260px] overflow-hidden rounded-xl px-[30px] py-[27px] flex flex-col justify-between items-end '>
                            <img src="/assets/offer.png" alt="" className='absolute top-0 -translate-x-1/2 xl:-translate-x-1/3 h-[260px] opacity-50 z-0' />
                            <img src="/assets/offermask.png" alt="" className='absolute right-0 top-0 h-[260px]  z-0' />
                            <div className='z-30 flex flex-col justify-between h-full'>

                                <div className='z-30'>
                                    <h1 className='text-white font-bold text-[40px] md:text-[50px] leading-none'>Get Flat 30% off</h1>
                                    <p className='text-[26px] text-white font-semibold mt-0.5 leading-none'>The best of the best</p>
                                </div>
                            <Link href={'/deals'}>
                                <button className='text-xl z-30 font-semibold w-fit flex items-center text-nowrap py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                            </Link>
                            </div>
                        </div>

                    </div>

                    <div className='flex  gap-2 sm:gap-5 w-full min-h-[400px] md:min-h-[540px]'>
                        <div className='bg-offer2 bg-no-repeat bg-cover w-1/2 h-full rounded-xl px-3 md:px-[30px] py-6 md:py-[27px] flex flex-col justify-end '>
                            <div>
                                <div className='flex gap-2 text-white leading-none flex-wrap'>
                                    <span className='text-[20px]  font-semibold'>$</span>
                                    <span className='text-[40px] md:text-[50px] font-semibold text-nowrap leading-none'>10 Off</span>
                                    <span className='text-[14px] italic self-end font-semibold'>Free Shipping</span>
                                </div>
                                <p className='text-[26px] text-white font-semibold mt-0.5 leading-none'>Order of $60 or More</p>
                            </div>
                            <Link href={'/deals'}>
                            <button className='md:text-xl mt-[34px] font-semibold w-fit flex items-center text-nowrap py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full hidden md:block' /></button>
                            </Link>
                        </div>
                        <div className='bg-offer3 bg-no-repeat bg-cover w-1/2 h-full rounded-xl px-3 md:px-[30px] py-6 md:py-[27px] flex flex-col justify-start '>
                            <div>
                                <div className='flex gap-2 text-white leading-none flex-wrap'>
                                    <span className='text-[20px]  font-semibold'>$</span>
                                    <span className='text-[40px] md:text-[50px] font-semibold text-nowrap leading-none'>10 Off</span>
                                    <span className='text-[14px] italic self-end font-semibold leading-none'>Free Shipping</span>
                                </div>
                                <p className='text-[26px] text-white font-semibold mt-0.5 leading-none '>Order of $60 or More</p>
                            </div>
                            <Link href={'/deals'}>
                            <button className='md:text-xl mt-[34px] font-semibold w-fit flex items-center text-nowrap py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] hidden md:block rounded-full' /></button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Offers
