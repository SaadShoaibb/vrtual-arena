'use client'
import React from 'react'

const Gallery = () => {
  return (
    <>
      <div id='gallery' className={`w-full  h-full  bg-blackish `}>
                <div className='w-full mx-auto max-w-[1600px] border-y py-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-4'>
                        <div>

                            <h1 className='text-gradiant text-[26px] font-semibold '>Gallery</h1>
                            <h1 className='text-white text-[40px] md:text-[50px] font-bold  leading-none'>Discover Our Best VRA Gallery</h1>
                        </div>
                        <div>
                            <p className='text-xl text-white font-light'>Step inside the Virtual Arena and explore unforgettable moments captured from our top tournaments, community events, and behind-the-scenes action. From intense gameplay to epic celebrations, this is where champions and memories are made.</p>
                            <button className='text-xl font-semibold mt-[36px] flex items-center text-nowrap py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>View All <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-[60px]'>
                        <div className='grid grid-cols-2 gap-5'>
                            <img src="/assets/g1.png" alt="" className='h-[315px] w-full col-span-1' />
                            <img src="/assets/g2.png" alt="" className='h-[315px] w-full col-span-1' />
                            <img src="/assets/g3.png" alt="" className='h-[315px] w-full col-span-2' />

                        </div>
                        <img src="/assets/g4.png" alt="" className=' w-full h-full' />
                        <div className='grid grid-cols-2 gap-5'>
                            <img src="/assets/g5.png" alt="" className='h-[315px] w-full col-span-2' />
                            <img src="/assets/g6.png" alt="" className='h-[315px] w-full col-span-1' />
                            <img src="/assets/g7.png" alt="" className='h-[315px] w-full col-span-1' />

                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Gallery
