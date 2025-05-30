'use client'
import React, { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import BookNowButton from '../common/BookNowButton';

const faqData = [
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
];

const WhyChoose = () => {
    const [openId, setOpenId] = useState(1);

    const toggleAccordion = (id) => {
        setOpenId(openId === id ? 1 : id);
    };

    return (
        <div id='why choose' className='w-full h-full bg-blackish'>
            <div className='w-full mx-auto max-w-[1600px] border-b pt-[113px] pb-[100px] flex justify-between items-center px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-4'>
                    <div className='flex flex-col'>
                        <h1 className='text-gradiant text-[26px] font-semibold'>Why Choose Us</h1>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold pb-5 leading-none'>Why VRA is the Perfect Choice for You?</h1>
                        <div className='flex flex-col w-full gap-4'>

                            {faqData.map((item) => (
                                <div key={item.id} className="w-full">
                                    <div
                                        className="flex justify-between items-center w-full pb-3 border-b cursor-pointer mt-[20px]"
                                        onClick={() => toggleAccordion(item.id)}
                                    >
                                        <h1 className="text-[20px] flex items-center gap-2 font-semibold text-white">
                                            {item.question}
                                        </h1>
                                        <FaAngleDown
                                            size={26}
                                            className={`text-white transform transition-transform ${openId === item.id ? "rotate-180" : "rotate-0"}`}
                                        />
                                    </div>
                                    {openId === item.id && (
                                        <p className="text-lg text-white font-light mt-2">{item.answer}</p>
                                    )}
                                </div>
                            ))}

                        </div>

                        <div className='flex items-center flex-col md:flex-row mt-[43px] gap-[30px]'>
                            <BookNowButton margin='' />
                            <span className='min-w-full md:min-w-0 md:min-h-full border'></span>
                            <div className='flex flex-col'>
                                <div className='flex items-center gap-2'>
                                    <h1 className='text-xl text-white font-semibold'>
                                        Start from <span className='text-gradiant'>$49</span>
                                    </h1>
                                </div>
                                <p className='text-[12px] text-white font-light'>30 Days Moneyback Guarantee!</p>
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
