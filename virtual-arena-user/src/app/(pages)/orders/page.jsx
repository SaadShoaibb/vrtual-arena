'use client'
import React, { Suspense } from 'react'
import Orders from './Orders'
import MainLayout from '@/app/components/MainLayout'

const OrderPage = () => {
  return (
    <Suspense fallback={"loading..."}>
            <MainLayout title={"My Orders"} btnTitle={"Orders"}>

               <Orders/>
               </MainLayout>
        </Suspense>
  )
}

export default OrderPage
