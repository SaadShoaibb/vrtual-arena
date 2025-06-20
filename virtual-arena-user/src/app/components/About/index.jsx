'use client'
import React from 'react'
import BookNowButton from '../common/BookNowButton'
import { translations } from '@/app/translations'

const About = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    
    return (
        <div id='about' className={`w-full h-full bg-blackish`}>
            <div className='w-full mx-auto max-w-[1600px] border-b pt-[113px] pb-[100px] flex justify-between items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-4'>
                    <div className='flex flex-col '>
                        <h1 className='text-gradiant text-[26px] font-semibold '>{t.aboutTitle}</h1>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold pb-5 border-b leading-none'>
                            {t.aboutHeading || "Transforming Reality Through Immersive Innovation"}
                        </h1>
                        <p className='text-xl text-white font-light mt-[22px]'>
                            {t.aboutDescription}
                        </p>

                        <h1 className='text-[30px] flex items-center gap-2 font-semibold text-white mt-[37px]'>
                            <span><img src="/icons/cursor.svg" alt="" /></span>
                            <span>{t.ourStory}</span>
                        </h1>
                        <p className='text-xl text-white font-light'>
                            {t.storyDescription1}
                        </p>

                        <h1 className='text-[30px] flex items-center gap-2 font-semibold text-white mt-[37px]'>
                            <span><img src="/icons/cursor.svg" alt="" /></span>
                            <span>{t.ourMission}</span>
                        </h1>
                        <p className='text-xl text-white font-light'>
                            {t.missionDescription}
                        </p>

                        <div className='flex items-center flex-col md:flex-row mt-[43px] gap-5 md:gap-[30px] '>
                            <BookNowButton margin='' locale={locale} />

                            <span className='min-w-full md:min-w-0 md:min-h-full border h-dden'></span>

                            <div className='flex flex-col'>
                                <div className='flex items-center gap-2'>
                                    <img src="/icons/star.svg" alt="" />
                                    <h1 className='text-xl text-white font-semibold'>{t.ratings || "4.8 Ratings"}</h1>
                                </div>
                                <p className='text-[12px] text-white font-light'>{t.trustedCustomers || "Trusted by over 11,000 customers"}</p>
                            </div>
                        </div>
                    </div>

                    <div className='relative min-h-full'>
                        <img src="/assets/about.png" alt="" className='object-center xl:absolute bottom-0 right-0' />
                        <img src="/assets/aboutmask.png" alt="" className='absolute bottom-0 right-0' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
