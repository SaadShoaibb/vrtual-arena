'use client'
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice'

// Translations
const translations = {
    en: {
        visaCardOffer: "Visa Card Offer",
        offOnOrder: "200 off on Order of $500",
        bookNow: "Book Now",
        getFlatOff: "Get Flat 30% off",
        bestOfBest: "The best of the best",
        dollarOff: "10 Off",
        freeShipping: "Free Shipping",
        orderOrMore: "Order of $60 or More"
    },
    fr: {
        visaCardOffer: "Offre Carte Visa",
        offOnOrder: "200 de réduction sur une commande de 500$",
        bookNow: "Réserver",
        getFlatOff: "Obtenez 30% de réduction",
        bestOfBest: "Le meilleur du meilleur",
        dollarOff: "10 de réduction",
        freeShipping: "Livraison gratuite",
        orderOrMore: "Commande de 60$ ou plus"
    }
};

const Offers = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    const dispatch = useDispatch();

    const handleBookNow = () => {
        dispatch(openBookModal());
    };
    
    return (
        <div id='offers' className={`w-full h-full bg-blackish overflow-hidden`}>
            <div className='w-full mx-auto max-w-[1600px] border-b py-[100px] flex justify-between items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 w-full'>
                    <div className='flex flex-col gap-2 sm:gap-5'>
                        <div className='bg-cardbg bg-no-repeat bg-cover w-full h-[260px] rounded-xl px-4 sm:px-[30px] py-[27px] flex flex-col justify-between'>
                            <div>
                                <h1 className='text-white font-bold text-[30px] sm:text-[40px] md:text-[50px] leading-none text-wrap-balance'>{t.visaCardOffer}</h1>
                                <p className='text-[18px] sm:text-[22px] md:text-[26px] text-white font-semibold mt-0.5 leading-tight text-wrap-balance'>{t.offOnOrder}</p>
                            </div>
                            <button
                                onClick={handleBookNow}
                                className='text-base sm:text-lg md:text-xl font-semibold w-fit flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] overflow-hidden hover:scale-105 transition-transform'
                            >
                                <span className="text-wrap-balance whitespace-normal">{t.bookNow}</span>
                                <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 sm:ml-[11px] flex-shrink-0 rounded-full' />
                            </button>
                        </div>
                        <div className='relative w-full h-[260px] overflow-hidden rounded-xl px-4 sm:px-[30px] py-[27px] flex flex-col justify-between items-end'>
                            <img src="/assets/offer.png" alt="" className='absolute top-0 -translate-x-1/2 xl:-translate-x-1/3 h-[260px] opacity-50 z-0' />
                            <img src="/assets/offermask.png" alt="" className='absolute right-0 top-0 h-[260px] z-0' />
                            <div className='z-30 flex flex-col justify-between h-full w-full'>
                                <div className='z-30'>
                                    <h1 className='text-white font-bold text-[30px] sm:text-[40px] md:text-[50px] leading-none text-wrap-balance'>{t.getFlatOff}</h1>
                                    <p className='text-[18px] sm:text-[22px] md:text-[26px] text-white font-semibold mt-0.5 leading-tight text-wrap-balance'>{t.bestOfBest}</p>
                                </div>
                                <button
                                    onClick={handleBookNow}
                                    className='text-base sm:text-lg md:text-xl z-30 font-semibold w-fit flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] overflow-hidden hover:scale-105 transition-transform self-end'
                                >
                                    <span className="text-wrap-balance whitespace-normal">{t.bookNow}</span>
                                    <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 sm:ml-[11px] flex-shrink-0 rounded-full' />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-2 sm:gap-5 w-full min-h-[400px] md:min-h-[540px]'>
                        <div className='bg-offer2 bg-no-repeat bg-cover w-1/2 h-full rounded-xl px-3 md:px-[30px] py-6 md:py-[27px] flex flex-col justify-end'>
                            <div>
                                <div className='flex gap-2 text-white leading-none flex-wrap'>
                                    <span className='text-[20px] font-semibold'>$</span>
                                    <span className='text-[30px] sm:text-[40px] md:text-[50px] font-semibold leading-none text-wrap-balance'>{t.dollarOff}</span>
                                </div>
                                <span className='text-[14px] italic font-semibold block text-wrap-balance text-white'>{t.freeShipping}</span>
                                <p className='text-[18px] sm:text-[22px] md:text-[26px] text-white font-semibold mt-0.5 leading-tight text-wrap-balance'>{t.orderOrMore}</p>
                            </div>
                            <button
                                onClick={handleBookNow}
                                className='text-base sm:text-lg md:text-xl mt-[34px] font-semibold w-fit flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] overflow-hidden hover:scale-105 transition-transform'
                            >
                                <span className="text-wrap-balance whitespace-normal">{t.bookNow}</span>
                                <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 sm:ml-[11px] flex-shrink-0 rounded-full hidden md:block' />
                            </button>
                        </div>
                        <div className='bg-offer3 bg-no-repeat bg-cover w-1/2 h-full rounded-xl px-3 md:px-[30px] py-6 md:py-[27px] flex flex-col justify-start'>
                            <div>
                                <div className='flex gap-2 text-white leading-none flex-wrap'>
                                    <span className='text-[20px] font-semibold'>$</span>
                                    <span className='text-[30px] sm:text-[40px] md:text-[50px] font-semibold leading-none text-wrap-balance'>{t.dollarOff}</span>
                                </div>
                                <span className='text-[14px] italic font-semibold block text-wrap-balance text-white'>{t.freeShipping}</span>
                                <p className='text-[18px] sm:text-[22px] md:text-[26px] text-white font-semibold mt-0.5 leading-tight text-wrap-balance'>{t.orderOrMore}</p>
                            </div>
                            <button
                                onClick={handleBookNow}
                                className='text-base sm:text-lg md:text-xl mt-[34px] font-semibold w-fit flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] overflow-hidden hover:scale-105 transition-transform'
                            >
                                <span className="text-wrap-balance whitespace-normal">{t.bookNow}</span>
                                <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 sm:ml-[11px] flex-shrink-0 rounded-full hidden md:block' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Offers
