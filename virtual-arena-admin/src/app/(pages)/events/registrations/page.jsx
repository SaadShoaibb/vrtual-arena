import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import ClientOnlyEventRegistrations from './ClientOnlyEventRegistrations'

const EventRegistrationsPage = () => {
  return (
    <Suspense fallback={"loading..."}>
      <DashboardLayout pageTitle={'Event Registrations'}>
        <ClientOnlyEventRegistrations/>
      </DashboardLayout>
    </Suspense>
  )
}

export default EventRegistrationsPage
