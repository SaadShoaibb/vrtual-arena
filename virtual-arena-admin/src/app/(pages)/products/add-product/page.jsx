import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense } from 'react'
import AddProduct from './AddProduct'

const AddProductPage = () => {
  return (
    <Suspense fallback={"loading..."}>
    <DashboardLayout pageTitle={'Add Product'}>
      <AddProduct/>
    </DashboardLayout>
    </Suspense>
  )
}

export default AddProductPage
