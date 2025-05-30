'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React, { Suspense } from 'react'
import Plans from './Plans'
import WhyChoose from '@/app/components/WhyChoose'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'

const PricingPage = () => {

return (
  <Suspense fallback={"loading ..."}>
  
  <div className="relative ">
  <Navbar/>
      <HeroHeader
      btn='Pricing'
      title='Pricing Plan'
      bg='bg-pricingbg'
      />
      <Plans/>
      <WhyChoose/>
      <Connected/>
      <Footer/>
    </div>
      </Suspense>
  )
}

export default PricingPage
