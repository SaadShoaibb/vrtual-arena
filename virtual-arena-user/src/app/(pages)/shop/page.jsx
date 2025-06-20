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

const Shop = () => {
  const { showModal } = useSelector(state => state.modal)
  const [activeCategory, setActiveCategory] = useState('all')
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'vr-essentials', name: 'VR Essentials', description: 'Eye masks, comfort accessories and more' },
    { id: 'vr-hardware', name: 'VR Hardware', description: 'Guns, rifles, charging stations, and peripherals' },
    { id: 'branded', name: 'Branded Merchandise', description: 'T-shirts, hats, caps with VRtual Arena logo' },
    { id: 'gift-cards', name: 'Gift Cards & Experiences', description: 'Pre-paid sessions and gift options' }
  ]
  
  return (
    <>
      <div className="relative">
        <Navbar/>
        <HeroHeader
          btn='Shop'
          title='Shop'
          bg='bg-pricingbg'
        />
        
        {/* Category Navigation */}
        <div className="bg-blackish py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Shop by Category</h2>
            
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
                  <p className="text-green-400 font-bold mt-2">Eye masks starting at $11.99 - 50% less than Amazon price!</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <ShopProducts category={activeCategory} />
        <Connected />
        <Footer />
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