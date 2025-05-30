'use client'
import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import AllNotifications from './AllNotification'

const NotificationPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={"All Notifications"}>
      <AllNotifications/>
    </DashboardLayout>
    </Suspense>
  )
}

export default NotificationPage
