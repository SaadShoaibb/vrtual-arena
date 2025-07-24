import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import Events from './Events'

const AllEventsPage = () => {
  return (
    <Suspense fallback={"loading..."}>
      <DashboardLayout pageTitle={'All Events'}>
        <Events/>
      </DashboardLayout>
    </Suspense>
  )
}

export default AllEventsPage
