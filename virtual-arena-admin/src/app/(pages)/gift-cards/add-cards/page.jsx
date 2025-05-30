import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import GiftCards from './GiftCards'

const AddCardPage = () => {
  return (
    <Suspense fallback={"Loading..."}>
    <DashboardLayout pageTitle={'Add Gift Cards'}>
      <GiftCards/>
    </DashboardLayout>
    </Suspense>
  )
}

export default AddCardPage
