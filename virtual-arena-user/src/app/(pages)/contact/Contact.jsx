'use client'
import React, { useState } from 'react'
import { FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaComments, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { translations } from '@/app/translations'

const Contact = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        agreeToTerms: false
    });

    const [formStatus, setFormStatus] = useState({
        isSubmitting: false,
        isSubmitted: false,
        error: null
    });

    const businessHours = [
        { day: t.mondayToFriday, hours: t.mondayToFridayHours },
        { day: t.saturday, hours: t.saturdayHours },
        { day: t.sunday, hours: t.sundayHours }
    ];

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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
                error: t.pleaseSelectItem || 'Please fill in all required fields'
            });
            return;
        }

        if (!formData.agreeToTerms) {
            setFormStatus({
                isSubmitting: false,
                isSubmitted: false,
                error: t.mustAgreeToTerms || 'You must agree to the terms and conditions'
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
                _subject: `VR Arena Contact (Contact Page): ${formData.firstName} ${formData.lastName}`,
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
                message: '',
                agreeToTerms: false
            });

        } catch (error) {
            console.error('Contact form error:', error);
            setFormStatus({
                isSubmitting: false,
                isSubmitted: false,
                error: error.message || t.unexpectedError || 'An error occurred while sending your message. Please try again.'
            });
        }
    };

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
                            {/* Business Locations */}
                            <div className="flex items-start space-x-4">
                                <FaMapMarkerAlt className="text-[#DB1FEB] text-xl mt-1" />
                                <div>
                                    <h3 className="text-white font-bold">{t.ourLocations}</h3>

                                    {/* Edmonton Location */}
                                    <div className="mb-3">
                                        <h4 className="text-white font-semibold text-lg">{t.ourLocation} (Main)</h4>
                                        <p className="text-white text-lg font-light">
                                            {t.locationAddress}
                                        </p>
                                    </div>

                                    {/* Forestburg Location */}
                                    <div className="mb-3">
                                        <h4 className="text-white font-semibold text-lg">{t.forestburgLocation}</h4>
                                        <p className="text-white text-lg font-light">
                                            {t.forestburgAddress}
                                        </p>
                                    </div>

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

                                    {/* Live Chat Button */}
                                    <div className="mt-6">
                                        <button
                                            onClick={() => {
                                                // Try multiple methods to open Tawk.to chat
                                                if (typeof window !== 'undefined') {
                                                    // Method 1: Try Tawk_API maximize
                                                    if (window.Tawk_API && window.Tawk_API.maximize) {
                                                        window.Tawk_API.maximize();
                                                        return;
                                                    }

                                                    // Method 2: Try clicking the Tawk.to widget
                                                    const tawkWidget = document.querySelector('#tawk-widget, .tawk-widget, [id*="tawk"]');
                                                    if (tawkWidget) {
                                                        tawkWidget.click();
                                                        return;
                                                    }

                                                    // Method 3: Wait for Tawk.to to load and try again
                                                    let attempts = 0;
                                                    const checkTawk = setInterval(() => {
                                                        attempts++;
                                                        if (window.Tawk_API && window.Tawk_API.maximize) {
                                                            window.Tawk_API.maximize();
                                                            clearInterval(checkTawk);
                                                        } else if (attempts > 10) {
                                                            clearInterval(checkTawk);
                                                            alert('Live chat is loading. Please try again in a moment or look for the chat widget in the bottom-right corner.');
                                                        }
                                                    }, 500);
                                                }
                                            }}
                                            className="bg-gradient-to-r from-[#DB1FEB] to-[#24CBFF] hover:opacity-90 transition-opacity text-white font-bold py-3 px-6 rounded-full flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                            </svg>
                                            Start Live Chat
                                        </button>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Or look for the chat widget in the bottom-right corner of your screen
                                        </p>
                                    </div>
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

                        {/* Success Message */}
                        {formStatus.isSubmitted && (
                            <div className="mt-6 p-4 bg-green-600/20 border border-green-500 rounded-xl flex items-center space-x-3">
                                <FaCheckCircle className="text-green-400 text-xl" />
                                <div>
                                    <h4 className="text-green-400 font-semibold">{t.messageSent || 'Message Sent Successfully!'}</h4>
                                    <p className="text-green-300 text-sm">{t.messageSentDesc || 'Thank you for contacting us. We will get back to you soon.'}</p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {formStatus.error && (
                            <div className="mt-6 p-4 bg-red-600/20 border border-red-500 rounded-xl flex items-center space-x-3">
                                <FaExclamationTriangle className="text-red-400 text-xl" />
                                <div>
                                    <h4 className="text-red-400 font-semibold">{t.errorOccurred || 'Error'}</h4>
                                    <p className="text-red-300 text-sm">{formStatus.error}</p>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {formStatus.isSubmitted && (
                            <div className="mb-6 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-400">
                                            {t.messageSent || 'Message Sent Successfully!'}
                                        </h3>
                                        <p className="text-green-300 mt-1">
                                            {t.messageConfirmation || 'Thank you for contacting us. We will get back to you within 24 hours.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {formStatus.error && (
                            <div className="mb-6 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-400">
                                            {t.errorOccurred || 'Error Occurred'}
                                        </h3>
                                        <p className="text-red-300 mt-1">
                                            {formStatus.error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="mt-6" onSubmit={handleSubmit}>
                            {/* First Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder={t.namePlaceholder}
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder={t.lastNamePlaceholder}
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                    required
                                />
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={t.emailPlaceholder}
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder={t.phonePlaceholder}
                                    className="bg-transparent focus:outline text-white p-5 rounded-xl border"
                                />
                            </div>

                            {/* Message Field */}
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder={t.messagePlaceholder}
                                className="w-full border mb-6 bg-transparent text-white focus:outline-none p-5 rounded-xl h-[220px] resize-none"
                                required
                            ></textarea>

                            <div className="flex items-center mb-6">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleInputChange}
                                    id="agreeToTerms"
                                    className='h-[22px] w-[22px] bg-transparent text-white checked:bg-transparent checked:text-white border border-white'
                                    required
                                />
                                <label htmlFor="agreeToTerms" className='text-xl font-light text-white ml-2 cursor-pointer'>{t.termsAndConditions}</label>
                            </div>

                            {/* Send Message Button */}
                            <button
                                type="submit"
                                disabled={formStatus.isSubmitting}
                                className='col-span-5 lg:col-span-2 xl:col-span-1 text-xl mt-[45px] font-semibold flex items-center h-fit w-fit my-auto py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {formStatus.isSubmitting ? (t.sending || 'Sending...') : t.submit}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
