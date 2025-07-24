'use client';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

/**
 * Load the Stripe publishable key from environment variable
 * This is used to initialize the Stripe instance for both payment intents and checkout sessions
 */
// Ensure we use the live (or explicitly provided) publishable key only.
// No fallback to test keys so that test card numbers are rejected in production.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

/**
 * PaymentForm component handles payment processing using Stripe
 * It supports both direct payment intents and checkout sessions
 * For most payment types, checkout sessions are preferred for simplicity and security
 */
const PaymentForm = ({ entity, userId, amount, onSuccess, onClose, type }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const router = useRouter();

  /**
   * Handle payment using Stripe Checkout Session
   * This is the preferred payment method for most payment types
   */
  const handleCheckoutSession = async () => {
    setProcessing(true);
    
    // Convert amount to number if it's a string
    const amountNumber = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Validate amount
    if (typeof amountNumber !== 'number' || isNaN(amountNumber) || amountNumber < 0.50) {
      setError('Amount must be a number and at least 0.50 USD');
      setProcessing(false);
      return;
    }
    
    try {
      // Construct payment URL that works for both local and production
      let paymentUrl;
      if (API_URL.includes('/user')) {
        // Production: API_URL is like '/api/v1/user', replace 'user' with 'payment'
        paymentUrl = API_URL.replace('/user', '/payment');
      } else {
        // Local: API_URL is like 'http://localhost:8080/api/v1', append '/payment'
        paymentUrl = `${API_URL}/payment`;
      }

      const response = await axios.post(
        `${paymentUrl}/create-checkout-session`,
        {
          user_id: userId,
          amount: amountNumber,
          entity_type: type,
          entity_id: entity || 0,
        },
        { headers: getAuthHeaders() }
      );

      const { sessionId } = response.data;
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(`Checkout failed: ${err.response?.data?.message || err.message}`);
      setProcessing(false);
    }
  };

  return (
    <div className="payment-form">
      {error && <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">{error}</div>}
      <button
        onClick={handleCheckoutSession}
        disabled={processing}
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
      <button
        onClick={onClose}
        className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
        disabled={processing}
      >
        Cancel
      </button>
    </div>
  );
};

/**
 * PaymentModal component that provides options for online payment or gift card redemption
 */
const PaymentModal = ({ isOpen, onClose, entity, userId, amount, onSuccess, onRedeemSuccess, type }) => {
  const [paymentOption, setPaymentOption] = useState('online');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
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

  /**
   * Handle gift card redemption
   * This sends the gift card code to the server for validation and redemption
   */
  const handleGiftCardRedeem = async () => {
    if (!giftCardCode.trim()) {
      setError('Please enter a gift card code');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders.Authorization) {
        setError('Authentication token not found. Please log in again.');
        setProcessing(false);
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/gift-cards/redeem`,
        {
          code: giftCardCode,
          amount,
          entity_id: entity.id,
          entity_type: type,
        },
        {
          headers: authHeaders
        }
      );

      if (response.data.success) {
        setRedeemSuccess(true);
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

  // Show success state for gift card redemption
  if (paymentOption === 'gift-card' && redeemSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
          <div className="p-4 text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              <p className="font-bold">Gift card redeemed successfully!</p>
              <p>Thank you for your purchase.</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Payment Options</h2>

        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded ${paymentOption === 'online' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => {
                setPaymentOption('online');
                setError(null);
              }}
            >
              Online Payment
            </button>
            <button
              className={`px-4 py-2 rounded ${paymentOption === 'gift-card' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => {
                setPaymentOption('gift-card');
                setError(null);
              }}
            >
              Gift Card
            </button>
          </div>

          {paymentOption === 'online' ? (
            <Elements stripe={stripePromise}>
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
                  disabled={processing}
                />
              </div>

              {error && <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">{error}</div>}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGiftCardRedeem}
                  disabled={processing}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Redeem Gift Card'}
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
