'use client'
import Connected from '@/app/components/Connected'
import Footer from '@/app/components/Footer'
import Navbar from '@/app/components/Navbar'
import { fetchCart } from '@/Store/ReduxSlice/addToCartSlice'
import React, { Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Checkout from './Checkout'
import { useSearchParams } from 'next/navigation'
import { translations } from '@/app/translations'

const CheckoutPage = () => {
    const dispatch = useDispatch()
    const { cart } = useSelector((state) => state.cart)
    const searchParams = useSearchParams()
    const locale = searchParams.get('locale') || 'en'
    const t = translations[locale] || translations.en
    useEffect(() => {
        dispatch(fetchCart());
    }, [])
    return (
        <Suspense fallback={"loadingg..."}>
            <div className="relative">
                <Navbar locale={locale} />
                <div className="h-[400px] overflow-x-hidden relative -mt-[90px] md:-mt-[110px]">

                    <div className="absolute inset-0 z-0 bg-black bg-gradient-to-tr from-[#00000000] to-[#00000080] bg-opacity-50 "></div>
                    <img src="/assets/header.png" alt="" className='absolute z-0 top-0 w-full h-full' />
                    <img src="/assets/header2.png" alt="" className='absolute z-0 top-0 w-full h-full' />

                    <div className={`bg-herobg bg-center bg-no-repeat bg-cover h-[400px]  overflow-hidden `} >
                        <div id='home' className={`relative w-full  h-full max-w-[1440px] mx-auto   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6`}>
                            {/* Transparent Overlay */}

                            <div className='w-full max-w-[1087px] mx-auto h-full'>
                                <div className='flex flex-col w-full h-full justify-center items-center mt-16 md:items-start'>

                                    <button className='bg-white text-black px-6 py-2.5 mx-auto leading-none text-xl font-semibold rounded-xl mb-5'>
                                        Checkout
                                    </button>
                                    <h1 className='text-white text-[50px] mb-6  w-full md:text-[70px]   leading-none  font-bold text-center  text-wrap'>Checkout</h1>


                                    <div className='flex flex-col md:flex-row items-center mt-6 gap-3 w-full justify-center'>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

                <Checkout cart={cart} locale={locale} />
                <Connected locale={locale} />
                <Footer locale={locale} />
            </div>
        </Suspense>
  )
}

export default CheckoutPage
