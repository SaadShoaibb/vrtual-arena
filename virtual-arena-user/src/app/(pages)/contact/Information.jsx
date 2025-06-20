'use client'
import React, { useState } from 'react'
import { FaPhone, FaEnvelope, FaHeadset, FaPlus, FaMinus } from 'react-icons/fa';
import { translations } from '@/app/translations';

const Information = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const contactInfo = [
        {
            icon: <FaPhone className="text-white text-2xl" />,
            title: t.phoneNumber1,
            secondaryTitle: t.phoneNumber2,
            desc: t.phoneDesc
        },
        {
            icon: <FaEnvelope className="text-white text-2xl" />,
            title: t.emailAddress,
            desc: t.emailDesc
        },
        {
            icon: <FaHeadset className="text-white text-2xl" />,
            title: t.liveChatTitle,
            desc: t.liveChatDesc
        }
    ];

    const FAQs = [
        {
            question: t.faq7Question || 'Do I need to make a reservation?',
            answer: t.faq7Answer || 'While walk-ins are welcome based on availability, we highly recommend booking in advance to secure your preferred experience and time slot, especially on weekends and holidays.'
        },
        {
            question: t.faq8Question || 'What is your cancellation policy?',
            answer: t.faq8Answer || 'Bookings can be cancelled or rescheduled up to 24 hours before your session for a full refund. Changes made within 24 hours may be subject to a fee.'
        },
        {
            question: t.faq1Question || 'Is there an age requirement for VR experiences?',
            answer: t.faq1Answer || 'Most of our experiences are suitable for ages 8 and up. Children under 13 must be accompanied by an adult. We offer special kid-friendly experiences like VR Warrior and VR CAT designed specifically for younger adventurers.'
        },
        {
            question: t.faqBookGroup || 'How do I book for a large group or private event?',
            answer: t.faqBookGroupAnswer || 'For groups of 6 or more, please contact us directly via phone or email. We offer special group rates and can arrange private events, birthday parties, and corporate functions.'
        }
    ];

    return (
        <div id='contact' className={`w-full h-full bg-blackish`}>
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[91px] pb-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <h1 className='text-gradiant text-[26px] font-semibold text-center'>{t.information}</h1>
                <h1 className='text-white text-[40px] md:text-[50px] font-bold text-center leading-none mt-2'>{t.contactInformation}</h1>

                <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 mt-14'>
                    {contactInfo.map((info, i) => (
                        <div key={i} className='min-h-[220px] overflow-hidden flex justify-center flex-col md:flex-row xl:flex-row lg:flex-col lg:py-6 xl:py-0 py-6 md:py-0 items-start md:items-center gap-5 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl px-5'>
                            <div className='bg-black p-[27px] rounded-xl h-[100px] min-w-[100px] flex items-center justify-center'>
                                {info.icon}
                            </div>
                            <div>
                                <h1 className='text-white text-xl md:text-[28px] font-bold'>
                                    {info.title}
                                </h1>
                                {info.secondaryTitle && (
                                    <h1 className='text-white text-xl md:text-[28px] font-bold'>
                                        {info.secondaryTitle}
                                    </h1>
                                )}
                                <p className='md:text-lg text-white'>{info.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-20">
                    <h1 className='text-gradiant text-[26px] font-semibold text-center'>{t.support}</h1>
                    <h1 className='text-white text-[40px] md:text-[50px] font-bold text-center leading-none mt-2 mb-10'>{t.faq}</h1>
                    
                    <div className="bg-gray-900 rounded-xl p-8 max-w-3xl mx-auto">
                        {FAQs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-800 py-4 last:border-b-0">
                                <button
                                    className="flex justify-between items-center w-full text-left"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                                    <div className="text-[#DB1FEB] ml-2">
                                        {openFAQ === index ? <FaMinus /> : <FaPlus />}
                                    </div>
                                </button>
                                {openFAQ === index && (
                                    <div className="mt-2 text-gray-300">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-8">
                        <p className="text-gray-300">
                            {t.haveMoreQuestions}{' '}
                            <a href="#contact" className="text-[#DB1FEB] hover:text-[#24CBFF] transition-colors">
                                {t.contactUs}
                            </a>
                            {' '}{t.happyToHelp}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Information
