'use client';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { API_URL, getAuthHeaders, validateToken } from '@/utils/ApiUrl';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

// Load the Stripe publishable key from environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QqzplJwuqd2a0tdgYOnwfBMxMzO66QWFCqzLN1winM5eGPI3iw4lMRriZrJvQF2kB76CxssHNDyJUpG54DJreHY00g79mEHeC')

const PaymentForm = ({ entity, userId, amount, onSuccess, onClose, type }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Create a payment intent when the component mounts
    const createPaymentIntent = async () => {
      try {
        // Debug: Log auth headers before sending request
        console.log('AUTH HEADERS', getAuthHeaders());
        
        // Debug: Check if user is authenticated in Redux
        const isAuthenticated = localStorage.getItem('token') ? true : false;
        console.log('Is user authenticated:', isAuthenticated);
        
        // Validate token before making the request
        if (isAuthenticated) {
          const isTokenValid = await validateToken();
          console.log('Is token valid:', isTokenValid);
          
          if (!isTokenValid) {
            console.error('Token validation failed, attempting to proceed anyway');
          }
        }
        
        const response = await axios.post(
          `${API_URL}/payment/create-payment-intent`,
          {
            amount,
            userId,
            entity_id: entity.id,
            entity_type: type,
            connected_account_id: entity.connected_account_id || null,
          },
          {
            headers: getAuthHeaders(),
          }
        );

        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError(`Payment setup failed: ${err.message || 'Unknown error'}`);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, entity.id, entity.connected_account_id, userId, type]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    try {
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setError(submitError.message);
        setProcessing(false);
        return;
      }

      // Confirm the payment with Stripe.js
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setError(`Payment failed: ${error.message}`);
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setError(null);
        setProcessing(false);
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(`Payment failed: ${err.message || 'Unknown error'}`);
      setProcessing(false);
    }
    };

    // Alternative: Use Stripe Checkout Session
    const handleCheckoutSession = async () => {
        setProcessing(true);
        try {
            // Create a checkout session on the server
            const response = await axios.post(
                `${API_URL}/payment/create-checkout-session`,
                {
                    user_id: userId,
                    entity_id: entity.id,
                    entity_type: type,
                    amount,
                    connected_account_id: entity.connected_account_id || null,
                },
                {
                    headers: getAuthHeaders(),
                }
            );

            const { sessionId } = response.data;
            
            // Redirect to Stripe Checkout
            if (!stripe) {
                throw new Error('Stripe failed to load');
            }
            
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
            setProcessing(false);
        }
    };

  // Show loading state while waiting for clientSecret
  if (!clientSecret && !error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-2">Loading payment form...</p>
      </div>
    );
  }

  return (
    <div className="payment-form-container p-4 bg-white rounded-lg shadow-md">
      {error && (
        <div className="payment-error mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {clientSecret ? (
        <form onSubmit={handleSubmit} className="payment-form space-y-4">
          <PaymentElement />

          <div className="payment-buttons flex flex-col space-y-2 mt-4">
            <button
              type="submit"
              disabled={!stripe || processing}
              className="payment-button w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay $${amount}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cancel-button w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="alternative-payment space-y-4">
          <p className="text-center text-gray-700">Use our secure checkout page instead:</p>
          <button
            type="button"
            onClick={handleCheckoutSession}
            disabled={processing}
            className="checkout-button w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Pay with Stripe Checkout`}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cancel-button w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, entity, userId, amount, onSuccess, onRedeemSuccess, type }) => {
  const [paymentOption, setPaymentOption] = useState('online');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [appearance, setAppearance] = useState({
    theme: 'stripe',
    variables: {
      colorPrimary: '#0070f3',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
  });

  const handleGiftCardRedeem = async () => {
    if (!giftCardCode.trim()) {
      setError('Please enter a gift card code');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/gift-cards/redeem`,
        {
          code: giftCardCode,
          amount,
          entity_id: entity.id,
          entity_type: type,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data.success) {
        onRedeemSuccess(response.data);
      } else {
        setError(response.data.message || 'Failed to redeem gift card');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to redeem gift card');
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  // Options for the Stripe Elements instance
  const options = {
    mode: 'payment',
    amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
    currency: 'usd',
    appearance,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Options</h2>

        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded ${paymentOption === 'online' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setPaymentOption('online')}
            >
              Online Payment
            </button>
            <button
              className={`px-4 py-2 rounded ${paymentOption === 'gift-card' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setPaymentOption('gift-card')}
            >
              Gift Card
            </button>
          </div>

          {paymentOption === 'online' ? (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm
                entity={entity}
                userId={userId}
                amount={amount}
                onSuccess={onSuccess}
                onClose={onClose}
                type={type}
              />
            </Elements>
          ) : (
            <div className="gift-card-form bg-gray-50 p-4 rounded-md">
              <div className="mb-4">
                <label htmlFor="gift-card" className="block text-sm font-medium text-gray-700 mb-1">
                  Gift Card Code
                </label>
                <input
                  type="text"
                  id="gift-card"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter gift card code"
                />
              </div>

              {error && <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">{error}</div>}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleGiftCardRedeem}
                  disabled={processing}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Redeem'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
