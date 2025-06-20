'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React, { Suspense } from 'react'
import Contact from './Contact'
import Information from './Information'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import { useSearchParams } from 'next/navigation'

const ContactPage = () => {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
 
  return (
    <Suspense fallback={"loading"}>
      <div className="relative">
        <Navbar locale={locale} />
        <HeroHeader
          btn='Contact Us'
          title='Contact Us'
          bg='bg-contactbg'
          locale={locale}
        />
        <Contact locale={locale} />
        <Information locale={locale} />
        <Connected locale={locale} />
        <Footer locale={locale} />
      </div>
    </Suspense>
  )
}

export default ContactPage
