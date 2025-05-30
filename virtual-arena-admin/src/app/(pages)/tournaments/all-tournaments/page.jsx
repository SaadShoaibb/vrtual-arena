import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import Tournaments from './Tournaments'

const AllTournamentPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={'All Tournament'}>
      <Tournaments/>
    </DashboardLayout>
    </Suspense>
  )
}

export default AllTournamentPage
