'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import Merchandises from './Merchandises'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import AuthModel from '@/app/components/AuthModal'
import AuthComponents from '@/app/components/AuthComponents'
import { useSelector } from 'react-redux'

const Merchandise = () => {
  const { showModal } = useSelector(state => state.modal)
  
  return (
    <>
      <div className="relative">
        <Navbar/>
        <HeroHeader
          btn='Shop'
          title='Shop'
          bg='bg-pricingbg'
        />
        <Merchandises/>
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

export default Merchandise
