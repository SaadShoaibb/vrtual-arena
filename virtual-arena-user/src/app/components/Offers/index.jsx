'use client'
import Link from 'next/link'
import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { openBookModal } from '@/Store/ReduxSlice/bookModalSlice'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Translations
const translations = {
    en: {
        noHiddenFees: "No Hidden Fees",
        noHiddenFeesDesc: "What you see is what you pay. All taxes included!",
        fullHour: "$35 / Full Hour",
        fullHourDesc: "Your one hour journey into a new reality. Full access, no limits.",
        twoFullHours: "$60 / Two Full Hours",
        twoFullHoursDesc: "Double the time, double the immersion. Perfect for dedicated players.",
        studentDeal: "Student Deal",
        studentDealDesc: "Show your student ID and get an extra 10% off your booking.",
        monthlyTournaments: "Monthly Tournaments",
        monthlyTournamentsDesc: "Compete for glory and win real prizes. Are you ready?",
        viewTournaments: "View Tournaments",
        bookNow: "Book Now"
    },
    fr: {
        noHiddenFees: "Pas de Frais Cachés",
        noHiddenFeesDesc: "Ce que vous voyez est ce que vous payez. Toutes les taxes incluses!",
        fullHour: "35$ / Heure Complète",
        fullHourDesc: "Votre voyage d'une heure dans une nouvelle réalité. Accès complet, sans limites.",
        twoFullHours: "60$ / Deux Heures Complètes",
        twoFullHoursDesc: "Double le temps, double l'immersion. Parfait pour les joueurs dévoués.",
        studentDeal: "Offre Étudiante",
        studentDealDesc: "Montrez votre carte d'étudiant et obtenez 10% de réduction supplémentaire sur votre réservation.",
        monthlyTournaments: "Tournois Mensuels",
        monthlyTournamentsDesc: "Compétez pour la gloire et gagnez de vrais prix. Êtes-vous prêt?",
        viewTournaments: "Voir les Tournois",
        bookNow: "Réserver"
    }
};

const Offers = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    const dispatch = useDispatch();
    const router = useRouter();

    const handleMouseMove = (e, ref) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (ref) => {
        if (!ref.current) return;
        ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    const handleBookNow = () => {
        dispatch(openBookModal());
    };

    const handleTournaments = () => {
        router.push(`/tournaments?locale=${locale}`);
    };
    
    return (
        <div id='offers' className={`w-full h-full bg-blackish overflow-hidden relative`}>
            {/* Galaxy Background Animation */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='galaxy-stars'></div>
                <div className='galaxy-glow'></div>
            </div>
            
            <div className='w-full mx-auto max-w-[1600px] border-b py-[100px] flex justify-between items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6 relative z-10'>
                {/* Bento Grid Layout */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 w-full'>
                    {/* Left Column - 2 stacked boxes */}
                    <div className='lg:col-span-5 flex flex-col gap-4'>
                        {/* Box 1: No Hidden Fees - Large */}
                        <motion.div
                            ref={useRef(null)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0 }}
                            viewport={{ once: true }}
                            onMouseMove={(e) => handleMouseMove(e, { current: e.currentTarget })}
                            onMouseLeave={(e) => handleMouseLeave({ current: e.currentTarget })}
                            style={{ transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                            className='bg-cardbg bg-no-repeat bg-cover w-full h-[260px] rounded-xl px-4 sm:px-[30px] py-[27px] flex flex-col justify-between'
                        >
                            <div>
                                <h3 className='text-white font-bold text-[30px] sm:text-[40px] leading-none'>{t.noHiddenFees}</h3>
                                <p className='text-[18px] sm:text-[22px] text-white font-semibold mt-2 leading-tight'>{t.noHiddenFeesDesc}</p>
                            </div>
                        </motion.div>

                        {/* Box 2: $35 / Full Hour */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            onMouseMove={(e) => handleMouseMove(e, { current: e.currentTarget })}
                            onMouseLeave={(e) => handleMouseLeave({ current: e.currentTarget })}
                            style={{ transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                            className='relative w-full h-[260px] overflow-hidden rounded-xl px-4 sm:px-[30px] py-[27px] flex flex-col justify-between'
                        >
                            <img src="/assets/offer.png" alt="" className='absolute top-0 -translate-x-1/2 xl:-translate-x-1/3 h-[260px] opacity-50 z-0' />
                            <img src="/assets/offermask.png" alt="" className='absolute right-0 top-0 h-[260px] z-0' />
                            <div className='z-10 flex flex-col justify-between h-full'>
                                <div>
                                    <h3 className='text-white font-bold text-[30px] sm:text-[40px] leading-none'>{t.fullHour}</h3>
                                    <p className='text-[18px] sm:text-[22px] text-white font-semibold mt-2 leading-tight'>{t.fullHourDesc}</p>
                                </div>
                                <button
                                    onClick={handleBookNow}
                                    className='text-base sm:text-lg font-semibold w-fit flex items-center py-2 md:py-4 px-4 sm:px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] transition-transform duration-300 hover:-translate-y-1'
                                >
                                    {t.bookNow}
                                    <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 sm:ml-[11px]' />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - 3 boxes in unique layout */}
                    <div className='lg:col-span-7 flex gap-4 min-h-[400px] md:min-h-[540px]'>
                        {/* Left side - 2 stacked smaller boxes */}
                        <div className='flex flex-col gap-4 w-1/2'>
                            {/* Box 3: $60 / Two Full Hours */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                onMouseMove={(e) => handleMouseMove(e, { current: e.currentTarget })}
                                onMouseLeave={(e) => handleMouseLeave({ current: e.currentTarget })}
                                style={{ transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                                className='bg-offer2 bg-no-repeat bg-cover h-full rounded-xl px-3 md:px-[30px] py-6 md:py-[27px] flex flex-col justify-between'
                            >
                                <div>
                                    <h3 className='text-white font-bold text-[24px] sm:text-[30px] leading-none'>{t.twoFullHours}</h3>
                                    <p className='text-[16px] sm:text-[20px] text-white font-semibold mt-2 leading-tight'>{t.twoFullHoursDesc}</p>
                                </div>
                                <button
                                    onClick={handleBookNow}
                                    className='text-base sm:text-lg font-semibold w-fit flex items-center py-2 md:py-4 px-4 sm:px-6 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] transition-transform duration-300 hover:-translate-y-1'
                                >
                                    {t.bookNow}
                                    <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 hidden md:block' />
                                </button>
                            </motion.div>

                            {/* Box 4: Student Deal */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                                onMouseMove={(e) => handleMouseMove(e, { current: e.currentTarget })}
                                onMouseLeave={(e) => handleMouseLeave({ current: e.currentTarget })}
                                style={{ transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                                className='bg-offer3 bg-no-repeat bg-cover h-full rounded-xl px-3 md:px-[30px] py-6 md:py-[27px] flex flex-col justify-between'
                            >
                                <div>
                                    <h3 className='text-white font-bold text-[24px] sm:text-[30px] leading-none'>{t.studentDeal}</h3>
                                    <p className='text-[16px] sm:text-[20px] text-white font-semibold mt-2 leading-tight'>{t.studentDealDesc}</p>
                                </div>
                                <button
                                    onClick={handleBookNow}
                                    className='text-base sm:text-lg font-semibold w-fit flex items-center py-2 md:py-4 px-4 sm:px-6 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] transition-transform duration-300 hover:-translate-y-1'
                                >
                                    {t.bookNow}
                                    <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 hidden md:block' />
                                </button>
                            </motion.div>
                        </div>

                        {/* Right side - 1 tall box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            onMouseMove={(e) => handleMouseMove(e, { current: e.currentTarget })}
                            onMouseLeave={(e) => handleMouseLeave({ current: e.currentTarget })}
                            style={{ transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)' }}
                            className='bg-cardbg bg-no-repeat bg-cover w-1/2 h-full rounded-xl px-3 md:px-[30px] py-6 md:py-[27px] flex flex-col justify-between'
                        >
                            <div>
                                <h3 className='text-white font-bold text-[24px] sm:text-[30px] md:text-[36px] leading-none'>{t.monthlyTournaments}</h3>
                                <p className='text-[16px] sm:text-[20px] md:text-[22px] text-white font-semibold mt-2 leading-tight'>{t.monthlyTournamentsDesc}</p>
                            </div>
                            <button
                                onClick={handleTournaments}
                                className='text-base sm:text-lg font-semibold w-fit flex items-center py-2 md:py-4 px-4 sm:px-6 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] transition-transform duration-300 hover:-translate-y-1'
                            >
                                {t.viewTournaments}
                                <img src="/icons/arrow.svg" alt="" className='h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] ml-2 hidden md:block' />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .galaxy-stars {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-image:
                        radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.4), transparent),
                        radial-gradient(2px 2px at 60% 70%, rgba(147, 107, 185, 0.3), transparent),
                        radial-gradient(1px 1px at 50% 50%, rgba(36, 203, 255, 0.3), transparent),
                        radial-gradient(1px 1px at 80% 10%, rgba(255, 255, 255, 0.3), transparent),
                        radial-gradient(2px 2px at 90% 60%, rgba(219, 31, 235, 0.3), transparent),
                        radial-gradient(1px 1px at 33% 80%, rgba(255, 255, 255, 0.2), transparent),
                        radial-gradient(1px 1px at 15% 60%, rgba(147, 107, 185, 0.2), transparent);
                    background-size: 200% 200%;
                    animation: galaxyMove 20s ease-in-out infinite;
                }
                
                .galaxy-glow {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(ellipse at 50% 50%, rgba(147, 107, 185, 0.05) 0%, transparent 50%);
                    animation: galaxyPulse 8s ease-in-out infinite;
                }
                
                @keyframes galaxyMove {
                    0%, 100% { background-position: 0% 0%; }
                    50% { background-position: 100% 100%; }
                }
                
                @keyframes galaxyPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
            `}</style>
        </div>
    )
}

export default Offers
