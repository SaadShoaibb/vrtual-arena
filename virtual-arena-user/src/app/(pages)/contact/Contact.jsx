'use client'
import React from 'react'
import { FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaComments } from 'react-icons/fa';
import { translations } from '@/app/translations'

const Contact = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;

    const businessHours = [
        { day: t.mondayToFriday, hours: t.mondayToFridayHours },
        { day: t.saturday, hours: t.saturdayHours },
        { day: t.sunday, hours: t.sundayHours }
    ];

    return (
        <div id='contact' className={`w-full h-full bg-blackish`}>
            <div className='w-full mx-auto max-w-[1600px] border-y pt-[91px] pb-[100px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12'>
                    <div className='w-full'>
                        <h1 className='text-gradiant text-[26px] font-semibold'>{t.contactTitle}</h1>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none'>{t.contactSubtitle}</h1>
                       
                        <p className='text-white text-lg font-light max-w-[720px] mt-3'>
                            {t.contactDescription}
                        </p>

                        {/* Business Information */}
                        <div className="mt-8 space-y-6">
                            {/* Business Address */}
                            <div className="flex items-start space-x-4">
                                <FaMapMarkerAlt className="text-[#DB1FEB] text-xl mt-1" />
                                <div>
                                    <h3 className="text-white font-bold">{t.ourLocation}</h3>
                                    <p className="text-white text-lg font-light">
                                        {t.locationAddress}
                                    </p>
                                    <p className="text-white text-sm">
                                        {t.corporation}
                                    </p>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="flex items-start space-x-4">
                                <FaClock className="text-[#DB1FEB] text-xl mt-1" />
                                <div>
                                    <h3 className="text-white font-bold">{t.businessHours}</h3>
                                    {businessHours.map((schedule, index) => (
                                        <div key={index} className="flex justify-between max-w-[300px]">
                                            <span className="text-white font-light">{schedule.day}</span>
                                            <span className="text-white font-light">{schedule.hours}</span>
                                        </div>
                                    ))}
                                    <p className="text-white text-sm mt-2">
                                        {t.phoneSupport}
                                    </p>
                                </div>
                            </div>

                            {/* Support Channels */}
                            <div className="flex items-start space-x-4">
                                <FaComments className="text-[#DB1FEB] text-xl mt-1" />
                                <div>
                                    <h3 className="text-white font-bold">{t.supportChannels}</h3>
                                    <p className="text-white text-lg font-light">
                                        {t.supportChannelsDesc}
                                    </p>
                                    <ul className="text-white list-disc list-inside">
                                        <li>{t.phoneSupport}</li>
                                        <li>{t.emailSupport}</li>
                                        <li>{t.liveChat}</li>
                                        <li>{t.onsiteAssistance}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* Google Map Integration */}
                        <div className="mb-8 rounded-xl overflow-hidden h-[300px]">
                            <iframe 
                                src="https://maps.google.com/maps?q=8109+102+St+NW,+Edmonton,+AB+T6E+4A4&output=embed" 
                                width="100%" 
                                height="100%" 
                                style={{border:0}} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        <form className="mt-6">
                            {/* First Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <input
                                    type="text"
                                    placeholder={t.namePlaceholder}
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                />
                                <input
                                    type="text"
                                    placeholder={t.lastNamePlaceholder}
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                />
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <input
                                    type="email"
                                    placeholder={t.emailPlaceholder}
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                />
                                <input
                                    type="text"
                                    placeholder={t.phonePlaceholder}
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                />
                            </div>

                            {/* Message Field */}
                            <textarea
                                placeholder={t.messagePlaceholder}
                                className="w-full border mb-6 bg-transparent text-white focus:outline-none p-5 rounded-xl h-[220px] resize-none "
                            ></textarea>

                            <input type="checkbox" name="" id="" className='h-[22px] w-[22px] bg-transparent text-white checked:bg-transparent checked:text-white border border-white' />
                            <span className='text-xl font-light text-white ml-2 '>{t.termsAndConditions}</span>

                            {/* Send Message Button */}
                            <button className='col-span-5 lg:col-span-2 xl:col-span-1 text-xl mt-[45px] font-semibold flex items-center h-fit w-fit my-auto py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>{t.submit}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
