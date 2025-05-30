'use client'
import React from 'react'

const Plans = () => {
    const basic = [
        "Cross-platform Synchronization",
        "Marketing, Regulatory & Public",
        "Compatibility with All VR Devices",
        "Assistance with Technical Issues",
        "Community Forums and Discussion",
        "Support Team with VR Experts",
    ]

    return (
        <div id='plans' className={`w-full h-full bg-blackish`}>
            <div className='w-full mx-auto max-w-[1600px] h-full border-b py-[100px] flex flex-wrap gap-y-6 text-white px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>

                <div className='w-full lg:w-1/2 xl:w-[40%] min-h-[570px] flex flex-col justify-between relative overflow-hidden rounded-xl'>
                    <img src="/assets/planmask.png" alt="" className='absolute bottom-0 left-0' />
                    <div className='pt-5 px-[28px]'>
                        <h1 className='text-[50px] md:text-[60px] font-bold leading-tight'>
                            Choose <br />Pricing Plan
                        </h1>
                        <p className='text-[20px] mt-6'>
                            Pick the perfect plan that suits your gaming or business needs. Flexible, affordable, and packed with features to get the most out of Vrtual Arena.
                        </p>
                    </div>
                    <img src="/assets/plan.png" alt="" className='h-[390px] max-w-[422px]' />
                </div>

                <div className='w-full lg:w-1/2 xl:w-[30%] px-2.5'>
                    <div className='rounded-[20px] py-6 md:py-[31px] px-6 md:px-[33px] border'>
                        <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                            <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                            <h1 className='text-white text-[26px] font-semibold z-10'>Basic Plan</h1>
                            <h1 className='text-[26px] z-10'>
                                <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>$149.25</span>
                                <span className='text-white text-[18px]'>/month</span>
                            </h1>
                        </div>
                        <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>
                            Perfect for solo users or startups beginning their VR journey.
                        </p>
                        <div className='flex flex-col gap-2.5 mt-[34px]'>
                            {basic.map((plan, i) => (
                                <div key={i} className='flex items-center gap-1.5'>
                                    <img src="/icons/check.png" alt="" />
                                    {plan}
                                </div>
                            ))}
                        </div>
                        <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>
                            Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' />
                        </button>
                    </div>
                </div>

                <div className='w-full lg:w-1/2 xl:w-[30%] px-2.5'>
                    <div className='rounded-[20px] py-6 md:py-[31px] px-6 md:px-[33px] border'>
                        <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                            <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                            <h1 className='text-white text-[26px] font-semibold z-10'>Basic Plan</h1>
                            <h1 className='text-[26px] z-10'>
                                <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>$149.25</span>
                                <span className='text-white text-[18px]'>/month</span>
                            </h1>
                        </div>
                        <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>
                            Ideal for small teams looking to enhance VR access and support.
                        </p>
                        <div className='flex flex-col gap-2.5 mt-[34px]'>
                            {basic.map((plan, i) => (
                                <div key={i} className='flex items-center gap-1.5'>
                                    <img src="/icons/check.png" alt="" />
                                    {plan}
                                </div>
                            ))}
                        </div>
                        <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>
                            Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Plans
