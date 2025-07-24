'use client'
import React from 'react'
import { translations } from '@/app/translations'

const Gallery = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
  return (
    <>
      <div id='gallery' className={`w-full  h-full  bg-blackish `}>
                <div className='w-full mx-auto max-w-[1600px] border-y py-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-4'>
                        <div>

                            <h1 className='text-gradiant text-[26px] font-semibold text-wrap-balance'>{t.gallery}</h1>
                            <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none text-wrap-balance'>{t.discoverGallery}</h1>
                        </div>
                        <div>
                            <p className='text-xl text-white font-light text-wrap-balance'>{t.galleryDescription}</p>
                            <button className='text-xl font-semibold mt-[36px] flex items-center text-nowrap py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>{t.viewAll} <img src="/icons/arrow.svg" alt="Arrow icon" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-[60px]'>
                        <div className='grid grid-cols-2 gap-5'>
                            <img src="/assets/g1.png" alt="VR gaming experience - Players enjoying virtual reality games" className='h-[315px] w-full col-span-1' />
                            <img src="/assets/g2.png" alt="VR Arena interior - Modern virtual reality gaming setup" className='h-[315px] w-full col-span-1' />
                            <img src="/assets/g3.png" alt="Group VR gaming session - Friends playing together in virtual reality" className='h-[315px] w-full col-span-2' />

                        </div>
                        <img src="/assets/g4.png" alt="VR equipment and technology - State-of-the-art virtual reality headsets" className=' w-full h-full' />
                        <div className='grid grid-cols-2 gap-5'>
                            <img src="/assets/g5.png" alt="VR battle arena - Immersive virtual reality combat experience" className='h-[315px] w-full col-span-2' />
                            <img src="/assets/g6.png" alt="VR simulator experience - Advanced virtual reality simulation" className='h-[315px] w-full col-span-1' />
                            <img src="/assets/g7.png" alt="VR party and events - Birthday celebrations and group activities" className='h-[315px] w-full col-span-1' />

                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Gallery
