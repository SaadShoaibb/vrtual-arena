'use client'
import HeroHeader from '@/app/components/HeroHeader'
import Navbar from '@/app/components/Navbar'
import React, { useState } from 'react'
import ShopProducts from './ShopProducts'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import AuthModel from '@/app/components/AuthModal'
import AuthComponents from '@/app/components/AuthComponents'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'next/navigation'
import { translations } from '@/app/translations'
import SEOHead from '@/app/components/SEOHead'


const Shop = () => {
  const { showModal } = useSelector(state => state.modal)
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') || 'en'
  const t = translations[locale] || translations.en
  const [activeCategory, setActiveCategory] = useState('all')
  
  const categories = [
    { id: 'all', name: t.allProducts },
    { id: 'vr-essentials', name: t.vrEssentials, description: t.vrEssentialsDesc },
    { id: 'vr-hardware', name: t.vrHardware, description: t.vrHardwareDesc },
    { id: 'branded', name: t.brandedMerchandise, description: t.brandedMerchandiseDesc },
    { id: 'gift-cards', name: t.giftCards, description: t.giftCardsDesc }
  ]
  
  return (
    <>
      <SEOHead page="shop" locale={locale} />
      <div className="relative">
        <Navbar locale={locale} />
        <HeroHeader
          btn={t.shop}
          title={t.shop}
          bg='bg-pricingbg'
          locale={locale}
        />
        
        {/* Category Navigation */}
        <div className="bg-blackish py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-6 text-center text-wrap-balance">{t.shopByCategory}</h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full transition-all ${
                    activeCategory === category.id 
                      ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white font-bold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {activeCategory !== 'all' && (
              <div className="mb-8 text-center">
                <p className="text-white text-lg">
                  {categories.find(c => c.id === activeCategory)?.description}
                </p>
                {activeCategory === 'vr-essentials' && (
                  <p className="text-green-400 font-bold mt-2 text-wrap-balance">{t.eyeMasksOffer}</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <ShopProducts category={activeCategory} locale={locale} />
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

export default Shop 