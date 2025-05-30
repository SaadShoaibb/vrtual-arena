import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import Payments from './Payments'

const PaymentPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={"Payment Details"}>
      <Payments/>
    </DashboardLayout>
    </Suspense>
  )
}

export default PaymentPage
