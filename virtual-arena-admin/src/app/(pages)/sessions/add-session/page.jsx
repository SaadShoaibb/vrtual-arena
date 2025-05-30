import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import CreateSession from './AddSession'

const AddSessionPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={'Add Sessions'}>
      <CreateSession/>
    </DashboardLayout>
    </Suspense>
  )
}

export default AddSessionPage
