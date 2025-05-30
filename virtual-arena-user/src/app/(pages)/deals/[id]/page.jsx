'use client'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React, { useState } from 'react'
import DealsDetail from '../DealsDetail'
import AuthModel from '@/app/components/AuthModal'
import AuthComponents from '@/app/components/AuthComponents'

const DealsDetailPage = () => {

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
                </>
    )
}

export default DealsDetailPage
