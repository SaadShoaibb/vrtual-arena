import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import Registrations from './AllRegistrations'

const RegistrationsPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout  pageTitle={'Tournament Registrations'}>
      <Registrations/>
    </DashboardLayout>
    </Suspense>
  )
}

export default RegistrationsPage
