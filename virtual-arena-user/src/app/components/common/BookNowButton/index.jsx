'use client'
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice'
import { openModal } from '@/Store/ReduxSlice/ModalSlice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const BookNowButton = ({margin}) => {
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector((state) => state.userData)
    const handleShowBookModal= ()=>{
        if(isAuthenticated){
            
            dispatch(openBookModal())
        }else{

            dispatch(openModal('LOGIN'))
        }
    }
  return (
    <button onClick={handleShowBookModal} className={`text-xl ${margin} font-semibold flex items-center text-nowrap py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] `}>Book Now <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
  )
}

export default BookNowButton
