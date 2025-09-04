import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import ExperienceMediaManager from './ExperienceMediaManager'

const ExperienceMediaPage = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <DashboardLayout pageTitle={'Experience Media Management'}>
        <ExperienceMediaManager />
      </DashboardLayout>
    </Suspense>
  )
}

export default ExperienceMediaPage