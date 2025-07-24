import MainLayout from '@/app/components/MainLayout'
import React, { Suspense } from 'react'
import EventRegistrations from './EventRegistrations'

const EventRegistrationsPage = () => {
  return (
    <Suspense fallback={"loading.."}>
    <MainLayout title={"Event registrations"} btnTitle={"Registrations"}>
      <EventRegistrations/>
    </MainLayout>
    </Suspense>
  )
}

export default EventRegistrationsPage
