'use client'
import React, { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import BookNowButton from '../common/BookNowButton';

// Translations for FAQ data
const translations = {
    en: {
        whyChooseUs: "Why Choose Us",
        whyPerfect: "Why VRA is the Perfect Choice for You?",
        startFrom: "Start from",
        moneyback: "30 Days Moneyback Guarantee!",
        faq: [
            {
                id: 1,
                question: "What is Virtual Arena (VRA)?",
                answer: "Virtual Arena is a premium destination for immersive VR gaming experiences. From solo adventures to multiplayer tournaments, VRA brings cutting-edge technology and unforgettable fun under one roof.",
            },
            {
                id: 2,
                question: "Do I need prior VR experience to play?",
                answer: "Not at all! Whether you're a beginner or a seasoned gamer, VRA is designed for all skill levels. Our team will guide you through everything you need to get started.",
            },
            {
                id: 3,
                question: "What kind of games are available at VRA?",
                answer: "We offer a wide variety of VR games—from action and adventure to puzzle-solving and sports simulations. There's something exciting for everyone.",
            },
            {
                id: 4,
                question: "Is VRA suitable for group events or parties?",
                answer: "Absolutely! VRA is perfect for birthday parties, corporate events, team-building sessions, and group hangouts. Ask us about our group booking packages!",
            },
        ]
    },
    fr: {
        whyChooseUs: "Pourquoi nous choisir",
        whyPerfect: "Pourquoi VRA est le choix parfait pour vous ?",
        startFrom: "À partir de",
        moneyback: "Garantie de remboursement de 30 jours !",
        faq: [
            {
                id: 1,
                question: "Qu'est-ce que Virtual Arena (VRA) ?",
                answer: "Virtual Arena est une destination premium pour des expériences de jeu VR immersives. Des aventures solo aux tournois multijoueurs, VRA réunit une technologie de pointe et un plaisir inoubliable sous un même toit.",
            },
            {
                id: 2,
                question: "Ai-je besoin d'une expérience VR préalable pour jouer ?",
                answer: "Pas du tout ! Que vous soyez débutant ou joueur expérimenté, VRA est conçu pour tous les niveaux de compétence. Notre équipe vous guidera à travers tout ce dont vous avez besoin pour commencer.",
            },
            {
                id: 3,
                question: "Quels types de jeux sont disponibles chez VRA ?",
                answer: "Nous proposons une grande variété de jeux VR, de l'action et l'aventure à la résolution d'énigmes et aux simulations sportives. Il y a quelque chose d'excitant pour tout le monde.",
            },
            {
                id: 4,
                question: "VRA convient-il aux événements de groupe ou aux fêtes ?",
                answer: "Absolument ! VRA est parfait pour les fêtes d'anniversaire, les événements d'entreprise, les sessions de team-building et les sorties en groupe. Renseignez-vous sur nos forfaits de réservation de groupe !",
            },
        ]
    }
};

const WhyChoose = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    const [openId, setOpenId] = useState(1);

    const toggleAccordion = (id) => {
        setOpenId(openId === id ? 1 : id);
    };

    return (
        <div id='why choose' className='w-full h-full bg-blackish overflow-hidden'>
            <div className='w-full mx-auto max-w-[1600px] border-b pt-[113px] pb-[100px] flex justify-between items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-4'>
                    <div className='flex flex-col'>
                        <h1 className='text-gradiant text-[26px] font-semibold'>{t.whyChooseUs}</h1>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold pb-5 leading-none text-wrap-balance'>{t.whyPerfect}</h1>
                        <div className='flex flex-col w-full gap-4'>

                            {t.faq.map((item) => (
                                <div key={item.id} className="w-full">
                                    <div
                                        className="flex justify-between items-center w-full pb-3 border-b cursor-pointer mt-[20px]"
                                        onClick={() => toggleAccordion(item.id)}
                                    >
                                        <h1 className="text-[18px] sm:text-[20px] flex items-center gap-2 font-semibold text-white text-wrap-balance pr-2">
                                            {item.question}
                                        </h1>
                                        <FaAngleDown
                                            size={26}
                                            className={`text-white transform transition-transform ${openId === item.id ? "rotate-180" : "rotate-0"} flex-shrink-0`}
                                        />
                                    </div>
                                    {openId === item.id && (
                                        <p className="text-base sm:text-lg text-white font-light mt-2 text-wrap-balance">{item.answer}</p>
                                    )}
                                </div>
                            ))}

                        </div>

                        <div className='flex items-center flex-col md:flex-row mt-[43px] gap-[30px]'>
                            <BookNowButton margin='' locale={locale} size={locale === 'fr' ? 'compact' : 'default'} />
                            <span className='min-w-full md:min-w-0 md:min-h-full border'></span>
                            <div className='flex flex-col'>
                                <div className='flex items-center gap-2'>
                                    <h1 className='text-base sm:text-xl text-white font-semibold text-wrap-balance'>
                                        {t.startFrom} <span className='text-gradiant'>$49</span>
                                    </h1>
                                </div>
                                <p className='text-[12px] text-white font-light text-wrap-balance'>{t.moneyback}</p>
                            </div>
                        </div>
                    </div>

                    <div className='relative min-h-full'>
                        <img src="/assets/why.png" alt="" className='object-center xl:absolute bottom-0 right-0' />
                        <img src="/assets/aboutmask.png" alt="" className='absolute bottom-0 right-0' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhyChoose
