'use client'
import React from 'react'

const Information = () => {
    const info=[
        {
            title:'+1 (763) 478-6014',
            tit:'+1 (800) 328-146',
            desc:'consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis pulvinar.'
        },
        {
            title:'hello@vrtualarena.com',
            desc:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis pulvinar.'
        },
        {
            title:'(+0) 123 456 7890',
            desc:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis pulvinar.'
        }
    ]
    return (
        <div id='contact' className={`w-full  h-full  bg-blackish `}>
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[91px] pb-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <h1 className='text-gradiant text-[26px] font-semibold text-center'>Information</h1>
                <h1 className='text-white text-[40px] md:text-[50px] font-bold text-center leading-none mt-2'>Contact Information</h1>

                <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 mt-14'>
                    {info.map((info,i)=>(

                        <div key={i} className='min-h-[220px] overflow-hidden flex justify-center flex-col md:flex-row xl:flex-row lg:flex-col lg:py-6 xl:py-0 py-6 md:py-0 items-start md:items-center   gap-5 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl px-5'>
                        <div className='bg-black p-[27px] rounded-xl h-[100px] min-w-[100px]'>
                            <img src="/icons/call.png" alt="" />
                          
                        </div>
                        <div>

                        <h1 className='text-white text-xl md:text-[28px] font-bold '>
                                {info.title}
                            </h1>
                            <h1 className='text-white text-xl md:text-[28px] font-bold'>
                            {info.tit}
                            </h1>
                            <p className=' md:text-lg text-white'>{info.desc}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Information
