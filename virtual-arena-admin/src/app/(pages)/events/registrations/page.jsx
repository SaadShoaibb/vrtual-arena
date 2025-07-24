import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import EventRegistrations from './EventRegistrations'

const EventRegistrationsPage = () => {
  return (
    <Suspense fallback={"loading..."}>
      <DashboardLayout pageTitle={'Event Registrations'}>
        <EventRegistrations/>
      </DashboardLayout>
    </Suspense>
  )
}

export default EventRegistrationsPage
