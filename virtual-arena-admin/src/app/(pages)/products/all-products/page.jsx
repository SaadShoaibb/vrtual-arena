import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import Products from './Products'

const AllProductPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={'Products'}>
        <Products/>
      
    </DashboardLayout>
    </Suspense>
  )
}

export default AllProductPage
