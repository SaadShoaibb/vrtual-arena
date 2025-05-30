'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import Merchandises from './Merchandises'

const Merchandise = () => {
  return (
    <div className="relative ">
  <Navbar/>
      <HeroHeader
      btn='Merchandise'
      title='Merchandise'
      bg='bg-pricingbg'
      />
      <Merchandises/>
    </div>
  )
}

export default Merchandise
