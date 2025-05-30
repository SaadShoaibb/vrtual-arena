import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import Sessions from './Sessions'

const AllSessionPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={'All Sessions'}>
      <Sessions/>
    </DashboardLayout>
    </Suspense>
  )
}

export default AllSessionPage
