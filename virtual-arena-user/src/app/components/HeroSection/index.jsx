'use client'

import React from 'react'

import BookNowButton from '../common/BookNowButton'

const HeroSection = () => {

  return (
    <div className="h-screen overflow-x-hidden relative -mt-[90px] md:-mt-[110px]">

          <div className="absolute inset-0 z-0 bg-black bg-gradient-to-tr from-[#00000000] to-[#00000080] bg-opacity-50 "></div>
         

            <div className="bg-herobg bg-center bg-no-repeat bg-cover h-screen  overflow-hidden " >
    <div id='home'  className={`relative w-full  h-full max-w-[1440px] mx-auto   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6`}>
    {/* Transparent Overlay */}
   
            <div className='w-full max-w-[1087px] mx-auto h-full'>
                <div  className='flex flex-col w-full h-full justify-center items-start mt-16 md:items-start'>

                   
                    <h1  className='text-white text-[50px]  w-full md:text-[80px]  lg:text-[100px] leading-none  font-bold text-center  text-wrap'>Explore the Future  </h1>
                    <h1 className='flex items-center w-full  justify-center text-white text-[50px]  md:text-[80px] r lg:text-[100px]  font-bold text-center  text-wrap leading-none'> With <img src="/assets/logo.png" alt=""  className='w-[174px] md:w-[199px] h-[61px] md:h-[85px]' /></h1>  
                    <p  className='text-white text-center w-full mt-2.5 text-xl '>Bringing you closer to reality through unforgettable VR experiences. </p>
                  <div className='flex flex-col md:flex-row items-center mt-6 gap-3 w-full justify-center'>

                  <BookNowButton 
                        margin=''
                        />
                    <button className='text-xl font-semibold flex items-center py-2 md:py-4 px-6 md:px-8 text-white rounded-full  '>Explore VR Packages<img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>


                    </div>
                </div>

            </div>
            </div>
            </div>

        </div>
  )
}

export default HeroSection
