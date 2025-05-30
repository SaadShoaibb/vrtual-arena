'use client'
import DashboardLayout from '@/components/DashboardLayout'
import React, { Suspense, useEffect } from 'react'
import Orders from './Orders'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '@/Store/ReduxSlice/orderSlice'

const OrderPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(fetchOrders()); // Fetch orders when component mounts
  }, [dispatch]);
  console.log(orders)
  return (
    <Suspense fallback={"loading..."}>
      <DashboardLayout pageTitle={'Orders'}>
        <Orders orders={orders} />

      </DashboardLayout>
    </Suspense>
  )
}

export default OrderPage
