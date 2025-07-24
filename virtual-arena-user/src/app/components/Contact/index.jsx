'use client'
import React, { useState } from 'react'

// Translations
const translations = {
    en: {
        contactUs: "Contact Us",
        getInTouch: "Get In Touch",
        phoneNumber: "Phone Number",
        phone: "+1 780-901-0804",
        emailAddress: "Email Address",
        email: "contact@vrtualarena.ca",
        location: "Location",
        address: "8109 102 St NW, Edmonton, AB T6E 4A4",
        corporation: "Corporation: ABOUDA Enterprise Inc.",
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
        phone: "+1 780-901-0804",
        emailAddress: "Adresse e-mail",
        email: "contact@vrtualarena.ca",
        location: "Emplacement",
        address: "8109 102 St NW, Edmonton, AB T6E 4A4",
        corporation: "Corporation: ABOUDA Enterprise Inc.",
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

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState({
        isSubmitting: false,
        isSubmitted: false,
        error: null
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
            setFormStatus({
                isSubmitting: false,
                isSubmitted: false,
                error: 'Please fill in all required fields'
            });
            return;
        }

        setFormStatus({
            isSubmitting: true,
            isSubmitted: false,
            error: null
        });

        try {
            // Submit directly to FormSubmit
            const formSubmitData = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone || 'Not provided',
                message: formData.message,
                _subject: `VR Arena Contact (Homepage): ${formData.firstName} ${formData.lastName}`,
                _captcha: 'false',
                _template: 'table'
            };

            const response = await fetch('https://formsubmit.co/ajax/affinitycoders@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formSubmitData)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error('Failed to send message');
            }

            // Success
            setFormStatus({
                isSubmitting: false,
                isSubmitted: true,
                error: null
            });

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });

        } catch (error) {
            console.error('Contact form error:', error);
            setFormStatus({
                isSubmitting: false,
                isSubmitted: false,
                error: error.message || 'An error occurred while sending your message. Please try again.'
            });
        }
    };
    
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
                        <h1 className='text-white text-sm  font-light leading-none mt-2'>{t.corporation}</h1>
                    </div>

                    <div>
                        <h1 className='text-white text-[40px] md:text-[50px] font-bold  leading-none'>{t.hearFromYou}</h1>
                        <h1 className=' text-[20px] text-white  mt-6'>{t.fillForm}</h1>

                        {/* Success Message */}
                        {formStatus.isSubmitted && (
                            <div className="mt-6 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-400">Message Sent Successfully!</h3>
                                        <p className="text-green-300 mt-1">Thank you for contacting us. We will get back to you within 24 hours.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {formStatus.error && (
                            <div className="mt-6 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-400">Error Occurred</h3>
                                        <p className="text-red-300 mt-1">{formStatus.error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                            {/* First Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder={t.firstName}
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder={t.lastName}
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                    required
                                />
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={t.emailField}
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder={t.phoneField}
                                    className="bg-transparent focus:outline text-white pb-2 border-b"
                                />
                            </div>

                            {/* Message Field */}
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder={t.message}
                                className="w-full border-b bg-transparent text-white focus:outline-none py-2 h-20 resize-none"
                                required
                            ></textarea>

                            {/* Send Message Button */}
                            <button
                                type="submit"
                                disabled={formStatus.isSubmitting}
                                className='hover:transition hover:-translate-y-1 hover:duration-500 col-span-5 lg:col-span-2 xl:col-span-1 text-xl mt-[60px] font-semibold flex items-center h-fit w-fit my-auto py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {formStatus.isSubmitting ? 'Sending...' : t.sendMessage}
                                <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' />
                            </button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Contact
