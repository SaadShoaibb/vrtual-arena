import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import ExperiencesManager from './ExperiencesManager'

const ExperiencesPage = () => {
  return (
    <Suspense fallback={'Loading...'}>
      <DashboardLayout pageTitle={'Experiences Management'}>
        <ExperiencesManager />
      </DashboardLayout>
    </Suspense>
  )
}

export default ExperiencesPage
