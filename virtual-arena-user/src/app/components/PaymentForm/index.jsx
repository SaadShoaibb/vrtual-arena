'use client';
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe('pk_test_51R1sVDPhzbqEOoSjq3Oyx0YSzQmwzsUaW2wsa3WLzv6ECsNv10SL0ymASJIES5yAi4k6lexmPFd1B3yPeaTxqHY500mRSfYdQq'); // Use your Stripe publishable key

const PaymentForm = ({ entity, userId, amount, onSuccess, onClose, type }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            setError('Stripe has not loaded yet. Please try again.');
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card details are not entered.');
            setLoading(false);
            return;
        }

        try {
            // Create a payment intent on the server
            const response = await axios.post(
                `${API_URL}/payment/create-payment-intent`,
                {
                    user_id: userId,
                    entity_id: entity,
                    entity_type: type,
                    amount,
                },
                getAuthHeaders()
            );

            console.log('Payment Intent Created:', response.data);

            const clientSecret = response.data?.clientSecret;
            if (!clientSecret) {
                throw new Error('Missing clientSecret in API response');
            }

            // Confirm the payment with Stripe.js
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { 
                    card: cardElement,
                    billing_details: {
                        // You can add billing details here if available
                        // name: 'Customer Name',
                        // email: 'customer@example.com',
                    }
                },
            });

            if (stripeError) {
                console.error('Stripe Error:', stripeError);
                setError(stripeError.message);
            } else if (paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded:', paymentIntent.id);
                // Payment succeeded - call onSuccess to complete the order
                onSuccess();
                onClose();
            } else {
                // Payment requires additional action or is processing
                console.log('Payment status:', paymentIntent.status);
                // You might want to show a different message based on the status
                onSuccess(); // Still call onSuccess as the webhook will handle the final status
                onClose();
            }
        } catch (err) {
            setError(err.message || 'Payment failed');
            console.error('Payment Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Alternative: Use Stripe Checkout Session
    const handleCheckoutSession = async () => {
        setLoading(true);
        try {
            // Create a checkout session on the server
            const response = await axios.post(
                `${API_URL}/payment/create-checkout-session`,
                {
                    user_id: userId,
                    entity_id: entity,
                    entity_type: type,
                    amount,
                },
                getAuthHeaders()
            );

            const { sessionId } = response.data;
            
            // Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: sessionId
            });

            if (result.error) {
                setError(result.error.message);
            }
        } catch (err) {
            setError(err.message || 'Failed to create checkout session');
            console.error('Checkout Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center">
            <div className="p-2 border rounded mx-auto w-full max-w-sm text-white">
            <CardElement 
        options={{ 
            style: { 
                base: { 
                    fontSize: "16px",
                    color: "white",
                    "::placeholder": { color: "white" } // Ensures placeholder is white
                } 
            } 
        }} 
    />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || loading}
                className="bg-white w-full text-black max-w-sm mx-auto px-4 py-2 rounded disabled:bg-gray-400"
            >
                {loading ? 'Processing...' : 'Pay with Card'}
            </button>
            <button
                type="button"
                onClick={handleCheckoutSession}
                disabled={!stripe || loading}
                className="bg-blue-500 w-full text-white max-w-sm mx-auto px-4 py-2 rounded disabled:bg-gray-400 mt-2"
            >
                {loading ? 'Processing...' : 'Checkout with Stripe'}
            </button>
        </form>
    );
};

const PaymentModal = ({ isOpen, onClose, entity, userId, amount, onSuccess, type, onRedeemSuccess }) => {
    const [option, setOption] = useState('card'); // 'card' or 'giftCard'
    const [code, setCode] = useState(''); // State for gift card code
    const { userData } = useSelector((state) => state.userData)
    if (!isOpen) return null;

    const handleOption = (selectedOption) => {
        setOption(selectedOption);
    };

    const handleInputChange = (e) => {
        setCode(e.target.value);
    };

    const handleRedeem = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/user/redeem`,
                { user_id: userId, user_gift_card_code: code, amount_used: amount },
                getAuthHeaders()
            );

            if (response.status === 200) {
                alert(`Gift card redeemed successfully! Remaining balance: $${response.data.remaining_balance}`);
                setCode('')
               onRedeemSuccess()
            }
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || 'Failed to redeem gift card.');
        }
    };

    return (
        <div className='flex justify-center items-center flex-col mt-16 w-full'>
            <h2 className="text-xl font-bold mb-4 text-white">Complete Your Purchase</h2>
            <p className="mb-4 text-white">You will pay: <span className="font-bold">${amount}</span></p>

            {/* Payment Options */}
            <div className='mb-6'>
                <button
                    className={`${option === "card" ? "bg-grad rounded-lg" : ""} px-6 text-white py-2`}
                    onClick={() => handleOption('card')}
                >
                    Online
                </button>
                <button
                    className={`${option === "giftCard" ? "bg-grad rounded-lg" : ""} px-6 text-white py-2`}
                    onClick={() => handleOption('giftCard')}
                >
                    Gift Card
                </button>
            </div>

            {/* Online Payment (Stripe) */}
            {option === "card" && (
                <Elements stripe={stripePromise} className="w-full">
                    <PaymentForm
                        entity={entity}
                        userId={userId}
                        amount={amount}
                        onSuccess={onSuccess}
                        onClose={onClose}
                        type={type}
                    />
                </Elements>
            )}

            {/* Gift Card Payment */}
            {option === "giftCard" && (
                <div className=''>
                    <h2 className="text-white text-xl font-bold mb-4">Complete Your Purchase</h2>
                    <p className="mb-4 text-white">You will pay: <span className="font-bold">${amount}</span></p>
                    <input
                        type="text"
                        placeholder="Enter gift card code"
                        value={code}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded bg-transparent text-white mb-2"
                    />
                    <button
                        onClick={handleRedeem}
                        className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
                    >
                        Buy with Card
                    </button>
                </div>
            )}
        </div>
           
    );
};

export default PaymentModal;
