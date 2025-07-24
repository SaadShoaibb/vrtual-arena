'use client'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import Deals from './Deals'
import GiftCards from './giftCards'
import { useSearchParams } from 'next/navigation'
import { translations } from '@/app/translations'

const DealsPage = () => {
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'en';
  const t = translations[locale] || translations.en;

  return (
    <>
      <div className="relative">
        <Navbar locale={locale} />
        <HeroHeader
          btn={t.dealsMembership}
          title={t.dealsMembership}
          bg='bg-dealbg'
          locale={locale}
        />
        <Deals locale={locale} />
        <GiftCards locale={locale} />
        <Connected locale={locale} />
        <Footer locale={locale} />
      </div>
    </>
  )
}

export default DealsPage
