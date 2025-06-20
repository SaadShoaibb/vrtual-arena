'use client'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React, { useEffect } from 'react'
import DealsDetail from '../DealsDetail'
import AuthModel from '@/app/components/AuthModal'
import AuthComponents from '@/app/components/AuthComponents'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDealById } from '@/Store/ReduxSlice/dealSlice'

const DealsDetailPage = ({ params }) => {
  const dealId = params.id
  const dispatch = useDispatch()
  const { showModal } = useSelector(state => state.modal)
  
  useEffect(() => {
    if (dealId) {
      dispatch(fetchDealById(dealId))
    }
  }, [dispatch, dealId])

  return (
    <>
      <div className="relative">
        <Navbar/>
        <HeroHeader
          btn='Deals & Membership'
          title='Deals & Membership'
          bg='bg-dealbg'
        />
        <DealsDetail />
        <Connected />
        <Footer />
      </div>
      {showModal && (
        <AuthModel>
          <AuthComponents />
        </AuthModel>
      )}
    </>
  )
}

export default DealsDetailPage
