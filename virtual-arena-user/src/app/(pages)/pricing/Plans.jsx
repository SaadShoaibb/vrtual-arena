'use clients'
import React from 'react'

const Plans = () => {
    const basic = [
        "Cross-platform Synchronization",
        "Marketing, Regulatory & Public",
        "Compatibility with Al VR Device",
        "Assistance with Technical Issues",
        "Community Forums and Discussion",
        "Support Team with VR Experts",

    ]
    return (
        <div id='events' className={`w-full  h-full  bg-blackish `}>
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[100px] pb-[51px] flex-col flex items-center  px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl w-[303px] px-5 py-[14px] flex gap-2'>
                    <button className='bg-white text-[26px] font-semibold px-8 py-4 rounded-xl  text-gradnt'><span className='text-gradiant'>Monthly</span> </button>
                    <button className='text-[26px] font-semibold text-white'>Yearly</button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-8  mt-[60px]'>
                <div className=' px-2.5'>
                    <div className='rounded-[20px] p-6 md:py-[31px] md:px-[33px] border'>
                        <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                            <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                            <h1 className='text-white text-[26px] font-semibold'>Basic Plan</h1>
                            <h1 className='text- text-[26px] '>
                                <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>$149.25</span>
                                <span className='text-white text-[18px] '>/month</span>
                            </h1>
                        </div>
                        <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>For individuals or small businesses with minimal storage needs</p>
                        <div className='flex flex-col gap-2.5 mt-[34px]'>

                            {basic.map((plan, i) => (
                                <div key={i} className='flex items-center gap-1.5 text-white'>
                                    <img src="/icons/check.png" alt="" className='' />
                                    {plan}
                                </div>
                            ))}


                        </div>
                        <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                    </div>
                </div>
                <div className=' px-2.5'>
                    <div className='rounded-[20px] p-6 md:py-[31px] md:px-[33px] border'>
                        <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                            <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                            <h1 className='text-white text-[26px] font-semibold'>Started Plan</h1>
                            <h1 className='text- text-[26px] '>
                                <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>$149.25</span>
                                <span className='text-white text-[18px] '>/month</span>
                            </h1>
                        </div>
                        <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>For individuals or small businesses with minimal storage needs</p>
                        <div className='flex flex-col gap-2.5 mt-[34px]'>

                            {basic.map((plan, i) => (
                                <div className='flex items-center gap-1.5 text-white'>
                                    <img src="/icons/check.png" alt="" className='' />
                                    {plan}
                                </div>
                            ))}


                        </div>
                        <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                    </div>
                </div>
                <div className=' px-2.5'>
                    <div className='rounded-[20px] p-6 md:py-[31px] md:px-[33px] border'>
                        <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                            <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                            <h1 className='text-white text-[26px] font-semibold'>Premium Plan</h1>
                            <h1 className='text- text-[26px] '>
                                <span className='text-[#23A1FF] text-[40px] md:text-[50px] font-semibold'>$149.25</span>
                                <span className='text-white text-[18px] '>/month</span>
                            </h1>
                        </div>
                        <p className='text-lg text-white mt-[28px] pb-[25px] leading-none border-b'>For individuals or small businesses with minimal storage needs</p>
                        <div className='flex flex-col gap-2.5 mt-[34px]'>

                            {basic.map((plan, i) => (
                                <div className='flex items-center gap-1.5 text-white'>
                                    <img src="/icons/check.png" alt="" className='' />
                                    {plan}
                                </div>
                            ))}


                        </div>
                        <button className='text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                    </div>
                </div>

                </div>
                <button className='text-xl mt-20 font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>Seel All <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
            </div>
        </div>
    )
}

export default Plans
