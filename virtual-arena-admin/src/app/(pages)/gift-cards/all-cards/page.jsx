import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import AllCards from './AllCards'

const AllCardsPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={'All Gift Cards'}>
      <AllCards/>
    </DashboardLayout>
    </Suspense>
  )
}

export default AllCardsPage
