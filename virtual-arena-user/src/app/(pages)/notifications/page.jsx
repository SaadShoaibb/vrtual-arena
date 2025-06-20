import MainLayout from '@/app/components/MainLayout'
import React from 'react'
import AllNotifications from './AllNotifications'

const NotificationPage = () => {
  return (
    <MainLayout title={'Notifications'} btnTitle={"Notifications"} skipBreadcrumb={true}>
        <AllNotifications/>
      
    </MainLayout>
  )
}

export default NotificationPage
