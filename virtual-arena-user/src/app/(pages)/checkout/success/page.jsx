'use client';
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const getCheckoutSession = async (sessionId) => {
    const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || 'sk_test_51R1sVDPhzbqEOoSjq3Oyx0YSzQmwzsUaW2wsa3WLzv6ECsNv10SL0ymASJIES5yAi4k6lexmPFd1B3yPeaTxqHY500mRSfYdQq', {
        apiVersion: '2023-10-16',
    });

    return stripe.checkout.sessions.retrieve(sessionId);
};

const CheckoutSuccessPage = async ({ searchParams }) => {
    const session_id = searchParams.session_id;

    if (!session_id) {
        redirect('/');
    }

    const session = await getCheckoutSession(session_id);

    if (!session) {
        redirect("/");
    }

    return (
        <div className="bg-blackish text-white">
            <Navbar />
            <div className='min-h-[60vh] flex items-center justify-center'>
                <div className='max-w-md w-full mx-auto p-6'>
                    <div className='bg-gray-900 rounded-2xl shadow-xl p-6 text-center'>
                        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                            </svg>
                        </div>
                        <h1 className='text-2xl font-bold text-white mb-2'>Thank you for your order!</h1>
                        <p className='text-gray-400 mb-6'>
                            We have received your order, and will send you a confirmation email shortly!
                        </p>
                        <div className='text-sm text-gray-400'>
                            Order total: {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: session.currency || 'CAD',
                            }).format((session.amount_total || 0) / 100)}
                        </div>
                        <div className='text-sm text-gray-400'>Order email: {session.customer_details?.email}</div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CheckoutSuccessPage;