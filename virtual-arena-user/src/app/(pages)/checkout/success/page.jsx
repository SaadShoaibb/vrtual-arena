'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const CheckoutSuccessPage = ({ searchParams }) => {
    const router = useRouter();
    const session_id = searchParams.session_id;
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!session_id) {
            router.push('/');
            return;
        }

        const fetchSession = async () => {
            try {
                const response = await axios.get(`/api/checkout/session?session_id=${session_id}`);
                setSession(response.data);
            } catch (err) {
                console.error('Error fetching session:', err);
                setError('Failed to load checkout information');
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [session_id, router]);

    if (loading) {
        return (
            <div className="bg-blackish text-white">
                <Navbar />
                <div className='min-h-[60vh] flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto'></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="bg-blackish text-white">
                <Navbar />
                <div className='min-h-[60vh] flex items-center justify-center'>
                    <div className='max-w-md w-full mx-auto p-6'>
                        <div className='bg-gray-900 rounded-2xl shadow-xl p-6 text-center'>
                            <h1 className='text-2xl font-bold text-white mb-2'>Something went wrong</h1>
                            <p className='text-red-500 mb-6'>{error || 'Could not find checkout session'}</p>
                            <button 
                                onClick={() => router.push('/')} 
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                            >
                                Return to home
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
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
                        <div className='text-sm text-gray-400 mb-2'>
                            Order total: {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: session.currency || 'USD',
                            }).format((session.amount_total || 0) / 100)}
                        </div>
                        <div className='text-sm text-gray-400 mb-2'>Order email: {session.customer_details?.email}</div>
                        {session.metadata?.entity_type && (
                            <div className='text-sm text-gray-400 mb-4'>Type: {session.metadata.entity_type}</div>
                        )}
                        <div className='mt-6 space-y-3'>
                            <button
                                onClick={() => router.push('/orders')}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                            >
                                View Your Orders
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CheckoutSuccessPage;