import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import AddTournament from './AddTournament'

const AddTournamentPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={'Add Tournament'}>
      <AddTournament/>
    </DashboardLayout>
    </Suspense>
  )
}

export default AddTournamentPage
