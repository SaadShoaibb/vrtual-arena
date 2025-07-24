import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import AddEvent from './AddEvent'

const AddEventPage = () => {
  return (
    <Suspense fallback={"loading..."}>
      <DashboardLayout pageTitle={'Add Event'}>
        <AddEvent/>
      </DashboardLayout>
    </Suspense>
  )
}

export default AddEventPage
