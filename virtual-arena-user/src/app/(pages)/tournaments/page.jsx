import MainLayout from '@/app/components/MainLayout'
import React, { Suspense } from 'react'
import Tournaments from './Tournaments'

const TournamentPage = () => {
  return (
    <Suspense fallback={"loading.."}>
    <MainLayout title={"Tournament registrations"} btnTitle={"Registrations"}>
      <Tournaments/>
    </MainLayout>
    </Suspense>
  )
}

export default TournamentPage
