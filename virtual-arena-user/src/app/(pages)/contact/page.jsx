'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React, { Suspense } from 'react'
import Contact from './Contact'
import Information from './Information'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import { useSearchParams } from 'next/navigation'
import { translations } from '@/app/translations'
import SEOHead from '@/app/components/SEOHead'


const ContactPage = () => {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;
 
  return (
    <Suspense fallback={"loading"}>
      <div className="relative">
        <SEOHead page="contact" locale={locale} />
        <Navbar locale={locale} />
        <HeroHeader
          btn={t.contactUs}
          title={t.contactUs}
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
