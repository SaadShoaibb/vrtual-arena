'use client'
import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import Bookings from './Bookings'

const AllBookingsPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={'All Bookings'}>
      <Bookings/>
    </DashboardLayout>
    </Suspense>
  )
}

export default AllBookingsPage
