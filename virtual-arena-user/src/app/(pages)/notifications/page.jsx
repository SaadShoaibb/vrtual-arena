import MainLayout from '@/app/components/MainLayout'
import React from 'react'
import AllNotifications from './AllNotifications'

const NotificationPage = () => {
  return (
    <MainLayout title={'Notifications'} btnTitle={"Notifications"}>
        <AllNotifications/>
      
    </MainLayout>
  )
}

export default NotificationPage
