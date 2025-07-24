import MainLayout from '@/app/components/MainLayout'
import React, { Suspense } from 'react'
import TournamentRegistrations from './TournamentRegistrations'

const TournamentRegistrationsPage = () => {
  return (
    <Suspense fallback={"loading.."}>
    <MainLayout title={"Tournament registrations"} btnTitle={"Registrations"}>
      <TournamentRegistrations/>
    </MainLayout>
    </Suspense>
  )
}

export default TournamentRegistrationsPage
