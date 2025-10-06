'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { translations } from '@/app/translations';
import { useSearchParams } from 'next/navigation';
import Footer from "@/app/components/Footer";

const CheckoutCancelPage = ({ searchParams }) => {
    const localeParam = searchParams.locale || 'en';
    const t = translations[localeParam] || translations.en;
    const router = useRouter();

    return (
        <div className="bg-blackish text-white">
            <Navbar locale={localeParam} />
            <div className='min-h-[60vh] flex items-center justify-center'>
                <div className='max-w-md w-full mx-auto p-6'>
                    <div className='bg-gray-900 rounded-2xl shadow-xl p-6 text-center'>
                        <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-8 h-8 text-yellow-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                            </svg>
                        </div>
                        <h1 className='text-2xl font-bold text-white mb-2'>
                            {t.paymentCancelled || 'Payment Cancelled'}
                        </h1>
                        <p className='text-gray-400 mb-6'>
                            {t.paymentCancelledDesc || 'Your payment was cancelled and no charges were made. Your booking is still pending payment.'}
                        </p>
                        <p className='text-sm text-gray-500 mb-6'>
                            {t.canRetryPayment || 'You can try again anytime from your bookings page.'}
                        </p>
                        <div className='mt-6 space-y-3'>
                            <button
                                onClick={() => router.push(`/bookings?locale=${localeParam}`)}
                                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
                            >
                                {t.viewYourBookings || 'View Your Bookings'}
                            </button>
                            <button
                                onClick={() => router.push(`/?locale=${localeParam}`)} 
                                className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                            >
                                {t.returnToHome || 'Return to Home'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer locale={localeParam} />
        </div>
    );
};

export default CheckoutCancelPage;
