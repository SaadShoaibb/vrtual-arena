import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import Users from './Users'

const UsersPage = () => {
    return (
        <Suspense fallback={"loading..."}>
        <DashboardLayout pageTitle={'Users'}>

<Users/>
        </DashboardLayout>
        </Suspense>
    )
}

export default UsersPage
