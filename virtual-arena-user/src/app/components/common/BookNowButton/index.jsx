'use client'
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice'
import { openModal } from '@/Store/ReduxSlice/ModalSlice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { translations } from '@/app/translations'

const BookNowButton = ({margin, locale = 'en', size = 'default'}) => {
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector((state) => state.userData)
    const t = translations[locale] || translations.en;
    
    const handleShowBookModal= ()=>{
        // Always open the booking modal - it handles guest vs registered user internally
        dispatch(openBookModal())
    }
    
    // Determine size-specific classes
    const sizeClasses = {
        'small': 'text-xs sm:text-sm py-1 px-2 sm:px-3',
        'default': 'text-base md:text-lg lg:text-xl py-1.5 md:py-2.5 lg:py-3 px-4 md:px-6 lg:px-8',
        'compact': 'text-sm sm:text-base py-1 px-3 sm:px-4'
    };
    
    const iconClasses = {
        'small': 'h-[14px] w-[14px] ml-1 sm:ml-2',
        'default': 'h-[18px] w-[18px] md:h-[22px] md:w-[22px] ml-2 md:ml-[11px]',
        'compact': 'h-[16px] w-[16px] ml-1.5 sm:ml-2'
    };
    
    return (
        <button 
            onClick={handleShowBookModal} 
            className={`${sizeClasses[size]} ${margin || ''} font-semibold flex items-center whitespace-nowrap text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] transition-transform hover:scale-105 overflow-hidden`}
        >
            {t.bookNow}
            <img src="/icons/arrow.svg" alt="" className={`${iconClasses[size]} rounded-full`} />
        </button>
    )
}

export default BookNowButton
