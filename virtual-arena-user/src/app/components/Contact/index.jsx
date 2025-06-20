'use client'
import React from 'react'

// Translations
const translations = {
    en: {
        contactUs: "Contact Us",
        getInTouch: "Get In Touch",
        phoneNumber: "Phone Number",
        phone: "+12013893990",
        emailAddress: "Email Address",
        email: "Mohamadghazoul@gmail.com",
        location: "Location",
        address: "187 Franklin Turnpike, Ho-Ho-Kus, NJ 07423, United States",
        hearFromYou: "We'd Love To Hear From You",
        fillForm: "Fill out the form below, and we'll get back to you at the earliest possible.",
        firstName: "First Name*",
        lastName: "Last Name*",
        emailField: "Email Address*",
        phoneField: "Phone Number*",
        message: "Write a Message*",
        sendMessage: "Send Message"
    },
    fr: {
        contactUs: "Contactez-nous",
        getInTouch: "Entrer en contact",
        phoneNumber: "Numéro de téléphone",
        phone: "+12013893990",
        emailAddress: "Adresse e-mail",
        email: "Mohamadghazoul@gmail.com",
        location: "Emplacement",
        address: "187 Franklin Turnpike, Ho-Ho-Kus, NJ 07423, États-Unis",
        hearFromYou: "Nous aimerions avoir de vos nouvelles",
        fillForm: "Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.",
        firstName: "Prénom*",
        lastName: "Nom de famille*",
        emailField: "Adresse e-mail*",
        phoneField: "Numéro de téléphone*",
        message: "Écrivez un message*",
        sendMessage: "Envoyer le message"
    }
};

const Contact = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    
    return (
        <div id='contact' className={`w-full  h-full  bg-blackish `}>
            <div className='w-full mx-auto max-w-[1600px] border-y py-[100px] flex-col flex   px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-center'>
                    <div className='w-full'>

                        <h1 className='text-gradiant text-[26px] font-semibold '>{t.contactUs}</h1>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold  leading-none'>{t.getInTouch}</h1>
                        <h1 className=' text-[30px] text-white  mt-8'>{t.phoneNumber}</h1>
                        <h1 className='text-white text-lg  font-light leading-none'>{t.phone}</h1>
                        <h1 className=' text-[30px] text-white  mt-6'>{t.emailAddress}</h1>
                        <h1 className='text-white text-lg  font-light leading-none'>{t.email}</h1>
                        <h1 className=' text-[30px] text-white  mt-6'>{t.location}</h1>
                        <h1 className='text-white text-lg  font-light leading-none'>{t.address}</h1>
                    </div>

                    <div>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold  leading-none'>{t.hearFromYou}</h1>
                        <h1 className=' text-[20px] text-white  mt-6'>{t.fillForm}</h1>

                        <form className="space-y-6 mt-6">
                            {/* First Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder={t.firstName}
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                />
                                <input
                                    type="text"
                                    placeholder={t.lastName}
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                />
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="email"
                                    placeholder={t.emailField}
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                />
                                <input
                                    type="text"
                                    placeholder={t.phoneField}
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                />
                            </div>

                            {/* Message Field */}
                            <textarea
                                placeholder={t.message}
                                className="w-full border-b  bg-transparent text-white focus:outline-none py-2 h-20 resize-none "
                            ></textarea>

                            {/* Send Message Button */}
                            <button className='hover:transition hover:-translate-y-1 hover:duration-500 col-span-5 lg:col-span-2 xl:col-span-1 text-xl mt-[60px]  font-semibold flex items-center h-fit w-fit  my-auto py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] '>{t.sendMessage} <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' /></button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Contact
