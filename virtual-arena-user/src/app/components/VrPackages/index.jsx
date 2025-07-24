'use client'
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice'
import { translations } from '@/app/translations'

const VRPackage = ({ locale = 'en' }) => {
  const t = translations[locale] || translations.en;
  const dispatch = useDispatch();

  const handleBookNow = () => {
    dispatch(openBookModal());
  };
  
  return (
    <div id='package' className={`w-full h-full bg-blackish overflow-hidden`}>
      <div className='w-full border-y py-[100px] flex-col flex'>
        <div className={`w-full min-h-[450px] bg-package bg-no-repeat bg-center relative`}>
          <div className="absolute inset-0 z-0 bg-black bg-gradient-to-tr from-[#003C66] to-[##580060] bg-opacity-50"></div>
          <div className='w-full mx-auto max-w-[1600px] py-[100px] flex items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
            <div className='w-full max-w-[858px] mx-auto flex flex-col justify-center items-center z-10'>
              <h3 className='text-white text-[24px] sm:text-[30px] text-wrap-balance text-center'>{t.letsGetStarted || 'Lets Get Started'}</h3>
              <h1 className='text-white text-[40px] sm:text-[60px] md:text-[70px] mt-3 font-bold leading-none text-center text-wrap-balance'>{t.readyToEnjoy || 'Ready to Enjoy?'}</h1>
              <p className='text-[16px] sm:text-[18px] text-white mt-3 text-center text-wrap-balance'>
                {t.vrPackageDescription || 'Dive into the action with our immersive VR gaming packages. Whether you\'re here for intense competition, team battles, or just pure fun—Virtual Arena offers experiences designed for every skill level and every thrill seeker.'}
              </p>
              <button
                onClick={handleBookNow}
                className='text-base sm:text-lg md:text-xl mt-3 font-semibold flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] overflow-hidden hover:scale-105 transition-transform'
              >
                <span className="text-wrap-balance whitespace-normal">{t.bookNow || 'Book Now'}</span>
                <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 sm:ml-[11px] flex-shrink-0 rounded-full' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VRPackage
