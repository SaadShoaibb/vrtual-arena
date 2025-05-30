'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React, { Suspense } from 'react'
import Contact from './Contact'
import Information from './Information'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'

const ContactPage = () => {
 
  return (
    <Suspense fallback={"loading"}>
   
    <div className="relative">
    <Navbar />
    <HeroHeader
    btn='Contact Us'
    title='Contact Us'
    bg='bg-contactbg'
    />
    <Contact/>
    <Information/>
    <Connected/>
    <Footer/>
    </div>
    </Suspense>
  )
}

export default ContactPage
