'use client'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import Deals from './Deals'
import GiftCards from './giftCards'

const DealsPage = () => {

return (
  <>
  
  <div className="relative">
  <Navbar  />
    <HeroHeader
    btn='Deals & Membership'
    title='Deals & Membership'
    bg='bg-dealbg'
    />
   <Deals/>
   <GiftCards/>
    <Connected/>
    <Footer/>
    </div>
    </>
  )
}

export default DealsPage
