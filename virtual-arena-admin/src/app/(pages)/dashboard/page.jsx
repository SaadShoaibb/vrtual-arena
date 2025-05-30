'use client'
import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense, useEffect } from 'react'
import Dashboard from './Dashboard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '@/Store/ReduxSlice/orderSlice'

const DashboardPage = () => {
   
  return (
    <Suspense fallback={"loading..."}>
      <DashboardLayout pageTitle={'Dashboard'}>
        <Dashboard />
      </DashboardLayout>
    </Suspense>
  )
}

export default DashboardPage
