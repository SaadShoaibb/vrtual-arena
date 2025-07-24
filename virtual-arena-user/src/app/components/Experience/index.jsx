'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

// Translations
const translations = {
    en: {
        experiences: "Experiences",
        gamingExperiences: "Our Gaming Experiences by Category",
        description: "Dive into a wide variety of immersive VR games—from intense action and exploration to fun family-friendly adventures. Our curated categories ensure there's something exciting for everyone at Vrtual Arena.",
        exploreExperiences: "Explore Experiences",
        happyClients: "HAPPY CLIENTS",
        productsSold: "PRODUCTS SOLD",
        popularFeatures: "POPULAR FEATURES",
        countriesServed: "COUNTRIES SERVED"
    },
    fr: {
        experiences: "Expériences",
        gamingExperiences: "Nos expériences de jeu par catégorie",
        description: "Plongez dans une grande variété de jeux VR immersifs, de l'action intense et l'exploration aux aventures familiales amusantes. Nos catégories soigneusement sélectionnées garantissent qu'il y a quelque chose d'excitant pour tout le monde à Virtual Arena.",
        exploreExperiences: "Explorer les expériences",
        happyClients: "CLIENTS SATISFAITS",
        productsSold: "PRODUITS VENDUS",
        popularFeatures: "FONCTIONNALITÉS POPULAIRES",
        countriesServed: "PAYS SERVIS"
    }
};

const Experience = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    const router = useRouter()

    return (
        <div id='experience' className={`w-full h-full bg-blackish overflow-hidden`}>
            <div className='w-full mx-auto max-w-[1600px] border-b py-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-4'>
                    <div>
                        <h1 className='text-gradiant text-[26px] font-semibold'>{t.experiences}</h1>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none text-wrap-balance'>
                            {t.gamingExperiences}
                        </h1>
                    </div>
                    <div>
                        <p className='text-xl text-white font-light text-wrap-balance'>
                            {t.description}
                        </p>
                        <button
                            onClick={() => router.push(`/experiences?locale=${locale}`)}
                            className="text-base sm:text-lg md:text-xl mt-4 hover:-translate-y-1 hover:transition hover:duration-500 font-semibold flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] overflow-hidden"
                        >
                            <span className="text-wrap-balance whitespace-normal">{t.exploreExperiences}</span>
                            <img
                                src="/icons/arrow.svg"
                                alt="Arrow icon"
                                className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 sm:ml-[11px] flex-shrink-0 rounded-full"
                            />
                        </button>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-[60px]'>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='grid grid-flow-col grid-rows-2 gap-4 w-full'>
                            <div className='bg-[#23A1FF] w-full max-w-[240px] rounded-xl flex justify-center items-center h-[200px]'>
                                <img src="/icons/exp1.png" alt="VR headset icon representing virtual reality experiences" />
                            </div>
                            <div className='bg-[#DB1FEB] w-full max-w-[240px] rounded-xl flex justify-center items-center h-[200px]'>
                                <div>
                                    <h1 className='text-white text-[45px] md:text-[60px] font-bold leading-none'>96k</h1>
                                    <h1 className='text-white text-[20px] sm:text-[26px] md:text-[30px] font-semibold leading-none text-wrap-balance'>{t.happyClients}</h1>
                                </div>
                            </div>
                            <img src="/assets/experience1.png" alt="VR gaming experience - Player immersed in virtual reality" className='row-span-2 object-cover w-full max-w-[240px] h-full' />
                        </div>
                        <div className='flex justify-center items-center gap-4 bg-[#23A1FF] rounded-xl h-[200px]'>
                            <img src="/icons/exp2.png" alt="Gaming controller icon representing VR gaming products" />
                            <div>
                                <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none'>150k</h1>
                                <h1 className='text-white text-[20px] sm:text-[24px] md:text-[30px] font-semibold leading-none text-wrap-balance'>{t.productsSold}</h1>
                            </div>
                        </div>
                    </div>

                    <img src="/assets/experience2.png" className='rounded-xl object-cover h-full' alt="VR gaming arena - Players enjoying immersive virtual reality experiences" />

                    <div className='flex flex-col gap-4 w-full'>
                        <div className='flex justify-center items-center gap-4 bg-[#23A1FF] rounded-xl h-[200px]'>
                            <img src="/icons/exp2.png" alt="Gaming controller icon representing popular VR features" />
                            <div>
                                <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none'>56k</h1>
                                <h1 className='text-white text-[20px] sm:text-[24px] md:text-[30px] font-semibold leading-none text-wrap-balance'>{t.popularFeatures}</h1>
                            </div>
                        </div>
                        <div className='grid grid-flow-col grid-rows-2 gap-4 w-full'>
                            <img src="/assets/experience3.png" alt="VR technology showcase - Advanced virtual reality equipment and setup" className='row-span-2 object-cover h-full w-full max-w-[240px]' />
                            <div className='bg-[#DB1FEB] w-full max-w-[240px] rounded-xl flex justify-center items-center h-[200px]'>
                                <div>
                                    <h1 className='text-white text-[45px] md:text-[60px] font-bold leading-none'>45k</h1>
                                    <h1 className='text-white text-[20px] sm:text-[24px] md:text-[30px] font-semibold leading-none text-wrap-balance'>{t.countriesServed}</h1>
                                </div>
                            </div>
                            <div className='bg-[#23A1FF] w-full max-w-[240px] rounded-xl flex justify-center items-center h-[200px]'>
                                <img src="/icons/exp1.png" alt="VR headset icon representing virtual reality technology" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Experience
