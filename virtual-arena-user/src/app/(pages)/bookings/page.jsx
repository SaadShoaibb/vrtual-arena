'use client'
import React, { Suspense } from 'react'
import Booking from './Booking'
import MainLayout from '@/app/components/MainLayout'

const BookingPage = () => {
  return (
    <Suspense fallback={"loading..."}>
             <MainLayout title={"My Bookings"} btnTitle={"Bookings"}>
               <Booking/>
               </MainLayout>
        </Suspense>
  )
}

export default BookingPage
