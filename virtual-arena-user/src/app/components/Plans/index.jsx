'use client'
import React from 'react'

// Translations
const translations = {
    en: {
        choosePricingPlan: "Choose Pricing Plan",
        planDescription: "Pick the perfect plan that suits your gaming or business needs. Flexible, affordable, and packed with features to get the most out of Vrtual Arena.",
        basicPlan: "Basic Plan",
        perMonth: "/month",
        soloDescription: "Perfect for solo users or startups beginning their VR journey.",
        teamDescription: "Ideal for small teams looking to enhance VR access and support.",
        bookNow: "Book Now",
        features: [
            "Cross-platform Synchronization",
            "Marketing, Regulatory & Public",
            "Compatibility with All VR Devices",
            "Assistance with Technical Issues",
            "Community Forums and Discussion",
            "Support Team with VR Experts",
        ]
    },
    fr: {
        choosePricingPlan: "Choisissez votre forfait",
        planDescription: "Choisissez le forfait parfait qui répond à vos besoins de jeu ou d'entreprise. Flexible, abordable et rempli de fonctionnalités pour tirer le meilleur parti de Virtual Arena.",
        basicPlan: "Forfait de base",
        perMonth: "/mois",
        soloDescription: "Parfait pour les utilisateurs individuels ou les startups qui commencent leur voyage en VR.",
        teamDescription: "Idéal pour les petites équipes cherchant à améliorer l'accès et le support VR.",
        bookNow: "Réserver",
        features: [
            "Synchronisation multiplateforme",
            "Marketing, réglementaire et public",
            "Compatibilité avec tous les appareils VR",
            "Assistance pour problèmes techniques",
            "Forums communautaires et discussions",
            "Équipe de support avec experts VR",
        ]
    }
};

const Plans = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;

    return (
        <div id='plans' className={`w-full h-full bg-blackish overflow-hidden`}>
            <div className='w-full mx-auto max-w-[1600px] h-full border-b py-[100px] flex flex-wrap gap-y-6 text-white px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>

                <div className='w-full lg:w-1/2 xl:w-[40%] min-h-[570px] flex flex-col justify-between relative overflow-hidden rounded-xl'>
                    <img src="/assets/planmask.png" alt="" className='absolute bottom-0 left-0' />
                    <div className='pt-5 px-[28px]'>
                        <h1 className='text-[40px] sm:text-[50px] md:text-[60px] font-bold leading-tight text-wrap-balance'>
                            {t.choosePricingPlan}
                        </h1>
                        <p className='text-base sm:text-[20px] mt-6 text-wrap-balance'>
                            {t.planDescription}
                        </p>
                    </div>
                    <img src="/assets/plan.png" alt="" className='h-[390px] max-w-[422px]' />
                </div>

                <div className='w-full lg:w-1/2 xl:w-[30%] px-2.5'>
                    <div className='rounded-[20px] py-6 md:py-[31px] px-6 md:px-[33px] border'>
                        <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                            <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                            <h1 className='text-white text-[22px] sm:text-[26px] font-semibold z-10 text-wrap-balance'>Basic</h1>
                            <h1 className='text-[22px] sm:text-[26px] z-10'>
                                <span className='text-[#23A1FF] text-[35px] sm:text-[40px] md:text-[50px] font-semibold'>$49.99</span>
                                <span className='text-white text-[16px] sm:text-[18px]'>{t.perMonth}</span>
                            </h1>
                        </div>
                        <p className='text-base sm:text-lg text-white mt-[28px] pb-[25px] leading-none border-b text-wrap-balance'>
                            4 free sessions + 10% off any other paid sessions
                        </p>
                        <div className='flex flex-col gap-2.5 mt-[34px]'>
                            <div className='flex items-start gap-1.5'>
                                <img src="/icons/check.png" alt="" className="flex-shrink-0 mt-1" />
                                <span className="text-wrap-balance">4 Free VR Sessions Monthly</span>
                            </div>
                            <div className='flex items-start gap-1.5'>
                                <img src="/icons/check.png" alt="" className="flex-shrink-0 mt-1" />
                                <span className="text-wrap-balance">10% Discount on Additional Sessions</span>
                            </div>
                            <div className='flex items-start gap-1.5'>
                                <img src="/icons/check.png" alt="" className="flex-shrink-0 mt-1" />
                                <span className="text-wrap-balance">Access to All VR Experiences</span>
                            </div>
                            <div className='flex items-start gap-1.5'>
                                <img src="/icons/check.png" alt="" className="flex-shrink-0 mt-1" />
                                <span className="text-wrap-balance">Priority Booking</span>
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.href = '/pricing'}
                            className='text-base sm:text-lg md:text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] overflow-hidden'>
                            <span className="text-wrap-balance whitespace-normal">View More</span>
                            <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 sm:ml-[11px] flex-shrink-0 rounded-full' />
                        </button>
                    </div>
                </div>

                <div className='w-full lg:w-1/2 xl:w-[30%] px-2.5'>
                    <div className='rounded-[20px] py-6 md:py-[31px] px-6 md:px-[33px] border'>
                        <div className='relative rounded-[20px] border border-[#23A1FF] flex flex-col justify-center items-center py-[30px] drop-shadow-xl shadow-[#209FFF]'>
                            <img src="/assets/shdow.png" alt="" className='absolute top-0 h-full z-0' />
                            <h1 className='text-white text-[22px] sm:text-[26px] font-semibold z-10 text-wrap-balance'>Premium</h1>
                            <h1 className='text-[22px] sm:text-[26px] z-10'>
                                <span className='text-[#23A1FF] text-[35px] sm:text-[40px] md:text-[50px] font-semibold'>$79.99</span>
                                <span className='text-white text-[16px] sm:text-[18px]'>{t.perMonth}</span>
                            </h1>
                        </div>
                        <p className='text-base sm:text-lg text-white mt-[28px] pb-[25px] leading-none border-b text-wrap-balance'>
                            8 sessions + 15% off any additional sessions
                        </p>
                        <div className='flex flex-col gap-2.5 mt-[34px]'>
                            <div className='flex items-start gap-1.5'>
                                <img src="/icons/check.png" alt="" className="flex-shrink-0 mt-1" />
                                <span className="text-wrap-balance">8 Free VR Sessions Monthly</span>
                            </div>
                            <div className='flex items-start gap-1.5'>
                                <img src="/icons/check.png" alt="" className="flex-shrink-0 mt-1" />
                                <span className="text-wrap-balance">15% Discount on Additional Sessions</span>
                            </div>
                            <div className='flex items-start gap-1.5'>
                                <img src="/icons/check.png" alt="" className="flex-shrink-0 mt-1" />
                                <span className="text-wrap-balance">Access to All VR Experiences</span>
                            </div>
                            <div className='flex items-start gap-1.5'>
                                <img src="/icons/check.png" alt="" className="flex-shrink-0 mt-1" />
                                <span className="text-wrap-balance">Priority Booking & Support</span>
                            </div>
                            <div className='flex items-start gap-1.5'>
                                <img src="/icons/check.png" alt="" className="flex-shrink-0 mt-1" />
                                <span className="text-wrap-balance">Exclusive Member Events</span>
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.href = '/pricing'}
                            className='text-base sm:text-lg md:text-xl mt-[43px] font-semibold flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] overflow-hidden'>
                            <span className="text-wrap-balance whitespace-normal">View More</span>
                            <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 sm:ml-[11px] flex-shrink-0 rounded-full' />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Plans
