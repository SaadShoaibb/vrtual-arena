'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React, { Suspense } from 'react'
import Plans from './Plans'
import WhyChoose from '@/app/components/WhyChoose'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import { useSearchParams } from 'next/navigation'
import { translations } from '@/app/translations'
import SEOHead from '@/app/components/SEOHead'


const PricingPage = () => {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;

  return (
    <Suspense fallback={"loading ..."}>
      <div className="relative">
        <SEOHead page="pricing" locale={locale} />
        <Navbar locale={locale} />
        <HeroHeader
          btn={t.pricing}
          title={t.pricingPlan}
          bg='bg-pricingbg'
          locale={locale}
        />
        <Plans locale={locale} />
        <WhyChoose locale={locale} />
        <Connected locale={locale} />
        <Footer locale={locale} />
      </div>
    </Suspense>
  )
}

export default PricingPage
