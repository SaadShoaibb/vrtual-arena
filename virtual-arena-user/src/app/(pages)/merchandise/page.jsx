'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React from 'react'
import Merchandises from './Merchandises'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import AuthModel from '@/app/components/AuthModal'
import AuthComponents from '@/app/components/AuthComponents'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { translations } from '@/app/translations'

const Merchandise = () => {
  const { showModal } = useSelector(state => state.modal)
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') || 'en'
  const t = translations[locale] || translations.en
  
  return (
    <>
      <div className="relative">
        <Navbar locale={locale} />
        <HeroHeader
          btn={t.shop}
          title={t.shop}
          bg='bg-pricingbg'
          locale={locale}
        />
        <Merchandises locale={locale} />
        <Connected locale={locale} />
        <Footer locale={locale} />
      </div>
      {showModal && (
        <AuthModel>
          <AuthComponents />
        </AuthModel>
      )}
    </>
  )
}

export default Merchandise
