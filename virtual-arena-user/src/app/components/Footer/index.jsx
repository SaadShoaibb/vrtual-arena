'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { translations } from '@/app/translations'

const Footer = ({ locale = 'en' }) => {
    const [email, setEmail] = useState('');
    const t = translations[locale] || translations.en;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Newsletter signup logic would go here
        console.log('Newsletter signup:', email);
        setEmail('');
        // Add toast notification or other feedback
    }

    return (
        <>
            <div id='footer' className={`w-full h-full bg-blackish`}>
                <div className='w-full mx-auto max-w-[1600px] border-y pt-[100px] pb-[88px] px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
                        {/* Business Information */}
                        <div>
                            <img src="/assets/logo.png" alt="Virtual Arena Logo" className='w-[199px] h-[85px]' />
                            <p className='font-light text-white max-w-[358px] mb-7'>
                                {t.heroSubtitle}
                            </p>

                            <h3 className='text-[22px] text-white font-bold mb-4'>{t.followUsColon}</h3>
                            <div className='flex gap-3 items-center'>
                                <a href="https://x.com/Vrtualarena" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/twitter.png" alt="Twitter" className="transition-all duration-500 ease-in-out hover:opacity-80 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=61574169838332" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/facebook.png" alt="Facebook" className="transition-all duration-500 ease-in-out hover:opacity-80 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                </a>
                                <a href="https://snapchat.com/t/EXvjkX2n" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/snapchat.png" alt="Snapchat" className="w-6 h-6 transition-all duration-500 ease-in-out hover:opacity-80 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                </a>
                                <a href="https://www.tiktok.com/@vrtualarena_ca?lang=en" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/tiktok.png" alt="TikTok" className="w-6 h-6 transition-all duration-500 ease-in-out hover:opacity-80 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                </a>
                                <a href="https://youtube.com/@vravrtualarena?si=uQJbt5rwCikqYGoE" target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/Youtube.png" alt="YouTube" className="transition-all duration-500 ease-in-out hover:opacity-80 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                </a>
                            </div>
                        </div>

                        {/* Main Navigation Links */}
                        <div className='text-white'>
                            <h3 className='text-[22px] font-bold mb-4'>{t.quickLinks}</h3>
                            <div className="mt-7 flex flex-col gap-5">
                                <Link href={`/?locale=${locale}`} className='font-light text-white hover:underline'>{t.home}</Link>
                                <Link href={`/about?locale=${locale}`} className='font-light text-white hover:underline'>{t.aboutUs}</Link>
                                <Link href={`/experiences?locale=${locale}`} className='font-light text-white hover:underline'>{t.experiences}</Link>
                                <Link href={`/pricing?locale=${locale}`} className='font-light text-white hover:underline'>{t.pricing}</Link>
                                <Link href={`/contact?locale=${locale}`} className='font-light text-white hover:underline'>{t.contactUs}</Link>
                            </div>
                        </div>

                        {/* Useful Links */}
                        <div className='text-white'>
                            <h3 className='text-[22px] font-bold mb-4'>{t.usefulLinks}</h3>
                            <div className="mt-7 flex flex-col gap-5">
                                <Link href={`/events?locale=${locale}`} className='font-light text-white hover:underline'>{t.eventsParties}</Link>
                                <Link href={`/merchandise?locale=${locale}`} className='font-light text-white hover:underline'>{t.merchandise}</Link>
                                <Link href={`/pricing?locale=${locale}`} className='font-light text-white hover:underline'>{t.pricingPlans}</Link>
                                <Link href={`/privacy-policy?locale=${locale}`} className='font-light text-white hover:underline'>{t.privacyPolicy}</Link>
                                <Link href={`/terms?locale=${locale}`} className='font-light text-white hover:underline'>{t.termsConditions}</Link>
                            </div>
                        </div>

                        {/* Contact Info and Newsletter */}
                        <div className='text-white'>
                            <h3 className='text-[22px] font-bold mb-4'>{t.contactUs}</h3>
                            <h3 className='font-light text-white mt-7 mb-5 flex items-center gap-2'>
                                <span><img src="/icons/phone.png" alt="" className='min-w-full min-h-full' /></span>
                                {t.phoneNumbers}
                            </h3>
                            <h3 className='font-light text-white mb-5 flex items-center gap-2'>
                                <span><img src="/icons/mail.png" alt="" className='min-w-full min-h-full' /></span>
                                {t.emailContact}
                            </h3>
                            <h3 className='font-light text-white mb-5 flex items-center gap-2 max-w-[347px]'>
                                <span><img src="/icons/location.png" alt="" className='min-h-full h-4 min-w-3' /></span>
                                {t.physicalAddress}
                            </h3>
                            
                            {/* Newsletter Signup */}
                            <h3 className='text-[22px] font-bold mt-8 mb-4'>{t.newsletter}</h3>
                            <form onSubmit={handleSubmit} className='mt-3'>
                                <div className='flex flex-col gap-2'>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t.emailPlaceholder}
                                        className='bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-md w-full'
                                        required
                                    />
                                    <button 
                                        type="submit"
                                        className='bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 text-white px-4 py-2 rounded-md'
                                    >
                                        {t.subscribe}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <p className='py-[22px] text-center bg-blackish w-full text-lg font-light text-white'>
                {t.copyright}
            </p>
        </>
    )
}

export default Footer
