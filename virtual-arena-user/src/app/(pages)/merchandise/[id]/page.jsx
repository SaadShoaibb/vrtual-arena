'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import MerchandiseDetail from '../MerchandiseDetail'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'

const MerchandiseDetailPage = () => {
  return (
    <div className="relative ">
    <Navbar/>
        <HeroHeader
        btn='Merchandise'
        title='Merchandise'
        bg='bg-pricingbg'
        />
        <MerchandiseDetail/>
        <Connected />
            <Footer />
      </div>
  )
}

export default MerchandiseDetailPage
