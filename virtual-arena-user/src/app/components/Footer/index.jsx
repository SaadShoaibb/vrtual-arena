'use client'
import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
        <>
            <div id='footer' className={`w-full h-full bg-blackish`}>
                <div className='w-full mx-auto max-w-[1600px] border-y pt-[100px] pb-[88px] flex justify-between flex-wrap gap-6 px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    <div>
                        <img src="/assets/logo.png" alt="" className='w-[199px] h-[85px]' />
                        <p className='font-light text-white max-w-[358px] mb-7'>
                            Bringing you closer to reality through unforgettable VR experiences.
                        </p>

                        <h1 className='text-[22px] text-white font-bold mb-4'>Follow Us:</h1>
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

                    <div className='text-white'>
                        <h1 className='text-[22px] font-bold'>Quick Links</h1>
                        <div className="mt-7 flex flex-col gap-5">
                            <Link href="/" className='font-light text-white hover:underline'>Home</Link>
                            <Link href="/#about" className='font-light text-white hover:underline'>About Us</Link>
                            <Link href="/#package" className='font-light text-white hover:underline'>Game</Link>
                            <Link href="/experiences" className='font-light text-white hover:underline'>Gallery</Link>
                            <Link href="#why choose" className='font-light text-white hover:underline'>FAQS</Link>
                        </div>
                    </div>

                    <div className='text-white'>
                        <h1 className='text-[22px] font-bold'>Useful Links</h1>
                        <div className="mt-7 flex flex-col gap-5">
                            <Link href="/deals" className='font-light text-white hover:underline'>VRA Service</Link>
                            <Link href="/pricing" className='font-light text-white hover:underline'>Pricing Plans</Link>
                            <Link href="/contact" className='font-light text-white hover:underline'>News & Articles</Link>
                            <Link href="/privacy-policy" className='font-light text-white hover:underline'>Privacy Policy</Link>
                            <Link href="/terms" className='font-light text-white hover:underline'>Terms & Conditions</Link>
                        </div>
                    </div>

                    <div className='text-white'>
                        <h1 className='text-[22px] font-bold'>Contact Us</h1>
                        <h3 className='font-light text-white mt-7 mb-5 flex items-center gap-2'>
                            <span><img src="/icons/phone.png" alt="" className='min-w-full min-h-full' /></span>
                            +1 (763) 478-6014   +1 (800) 328-1466
                        </h3>
                        <h3 className='font-light text-white mb-5 flex items-center gap-2'>
                            <span><img src="/icons/mail.png" alt="" className='min-w-full min-h-full' /></span>
                            hello@vrtualarena.com
                        </h3>
                        <h3 className='font-light text-white mb-5 flex items-center gap-2 max-w-[347px]'>
                            <span><img src="/icons/location.png" alt="" className='min-h-full h-4 min-w-3' /></span>
                            Loram Maintenance of Way 3900 Arrowhead Dr. | P.O. Box 188 | Hamel, MN 55340.
                        </h3>
                    </div>
                </div>
            </div>
            <p className='py-[22px] text-center bg-blackish w-full text-lg font-light text-white'>
                Copyright © 2024 Vrtual Arena All Rights Reserved.
            </p>
        </>
    )
}

export default Footer
