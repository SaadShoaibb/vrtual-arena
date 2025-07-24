'use client'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice';
import { fetchUserData } from '@/Store/Actions/userActions';
import { useTranslation } from '@/app/hooks/useTranslation';
import { API_URL } from '@/utils/ApiUrl';

const PaymentOptionsModal = ({ isOpen, onClose, tournament, type = 'tournament' }) => {
  const [paymentChoice, setPaymentChoice] = useState('online');
  const [userType, setUserType] = useState('user'); // 'user' or 'guest'
  const [guestData, setGuestData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: ''
  });
  const [step, setStep] = useState(1); // 1: user type, 2: guest details, 3: payment
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData } = useSelector((state) => state.userData);

  const handlePaymentChoiceChange = (choice) => {
    setPaymentChoice(choice);
  };

  const handleGuestDataChange = (e) => {
    const { name, value } = e.target;
    setGuestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeSelect = (selectedType) => {
    setUserType(selectedType);
    if (selectedType === 'user') {
      // Check authentication for registered users
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        toast.error("Please login to continue");
        onClose();
        return;
      }
      setStep(3); // Go directly to payment
    } else {
      setStep(2); // Go to guest details
    }
  };

  const handleGuestDetailsSubmit = (e) => {
    e.preventDefault();
    if (!guestData.guest_name || !guestData.guest_email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(3); // Go to payment
  };

  const handlePaymentOptionSelect = () => {
    try {
      if (!tournament) {
        toast.error("Please select an item first");
        return;
      }

      let payload;

      if (userType === 'guest') {
        // Guest registration - use direct API calls
        if (type === 'tournament') {
          payload = {
            tournament_id: tournament.tournament_id,
            guest_name: guestData.guest_name,
            guest_email: guestData.guest_email,
            guest_phone: guestData.guest_phone,
            payment_option: paymentChoice
          };
        } else if (type === 'event') {
          payload = {
            event_id: tournament.event_id,
            guest_name: guestData.guest_name,
            guest_email: guestData.guest_email,
            guest_phone: guestData.guest_phone,
            payment_option: paymentChoice
          };
        }
      } else {
        // Registered user - use cart system
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          toast.error("Please login to continue");
          onClose();
          return;
        }

        if (type === 'tournament') {
          payload = {
            tournament_id: tournament.tournament_id,
            quantity: 1,
            item_type: 'tournament',
            payment_option: paymentChoice
          };
        } else if (type === 'event') {
          payload = {
            event_id: tournament.event_id,
            quantity: 1,
            item_type: 'event',
            payment_option: paymentChoice
          };
        }
      }
      
      if (userType === 'guest') {
        // Handle guest registration with direct API calls
        const apiEndpoint = type === 'tournament'
          ? `${API_URL}/user/guest-tournament-registration`
          : `${API_URL}/user/guest-event-registration/${tournament.event_id}`;

        console.log(`Guest ${type} registration with payload:`, payload);

        axios.post(apiEndpoint, payload)
          .then(async (response) => {
            const registration = response.data.registration;

            if (paymentChoice === 'online') {
              // For online payment, proceed to Stripe checkout
              try {
                console.log('Creating checkout session for guest registration...');
                const checkoutPayload = {
                  user_id: 0, // Guest user
                  amount: tournament.ticket_price || tournament.entry_fee || 0,
                  entity_type: type === 'tournament' ? 'tournament_registration' : 'event_registration',
                  entity_id: registration.registration_id,
                  guest_info: {
                    name: guestData.guest_name,
                    email: guestData.guest_email,
                    phone: guestData.guest_phone
                  }
                };

                console.log('Checkout payload:', checkoutPayload);

                const checkoutResponse = await axios.post(`${API_URL}/payment/create-checkout-session`, checkoutPayload);

                console.log('Checkout response:', checkoutResponse.data);

                // Validate the response
                if (checkoutResponse.data && checkoutResponse.data.url) {
                  console.log('Redirecting to Stripe checkout:', checkoutResponse.data.url);
                  window.location.href = checkoutResponse.data.url;
                } else {
                  console.error('Invalid checkout response - no URL provided');
                  toast.error('Payment session created but redirect URL is missing. Please contact support.');
                }
              } catch (checkoutError) {
                console.error('Error creating checkout session:', checkoutError);
                console.error('Error details:', checkoutError.response?.data);

                // Check if it's a database schema issue
                if (checkoutError.response?.status === 500) {
                  const errorMessage = checkoutError.response?.data?.message || '';
                  if (errorMessage.includes('Data truncated') || errorMessage.includes('entity_type')) {
                    toast.error('Database needs updating. Please contact support or try "Pay at Event" option.');
                  } else {
                    toast.error('Payment system error. Please try "Pay at Event" option or contact support.');
                  }
                } else {
                  toast.error('Failed to create payment session. Please try again or use "Pay at Event" option.');
                }
              }
            } else {
              // For 'at event' payment, just show success message
              onClose();
              const successMessage = type === 'tournament'
                ? `You have been registered for the tournament as a guest. Registration reference: ${registration.registration_reference}. Payment will be collected at the event.`
                : `You have been registered for the event as a guest. Registration reference: ${registration.registration_reference}. Payment will be collected at the event.`;
              toast.success(successMessage);

              // Reset form
              setStep(1);
              setUserType('user');
              setGuestData({ guest_name: '', guest_email: '', guest_phone: '' });
            }
          })
          .catch((error) => {
            console.error(`Error in guest ${type} registration:`, error);
            toast.error(error?.response?.data?.message || `Failed to register for ${type}`);
          });
      } else {
        // Handle registered user registration with cart system
        console.log(`Adding ${type} to cart with payload:`, payload);

        dispatch(addToCart(payload))
          .unwrap()
          .then((response) => {
            onClose();

            if (paymentChoice === 'at_event') {
              // For 'Pay at Event', show success message but don't redirect to cart
              const successMessage = type === 'tournament'
                ? "You have been registered for the tournament. Payment will be collected at the event."
                : "You have been registered for the event. Payment will be collected at the event.";
              toast.success(response?.message || successMessage);
              dispatch(fetchUserData()); // Refresh user data to update registrations
            } else {
              // For online payment, add to cart and redirect
              const successMessage = type === 'tournament'
                ? "Tournament ticket added to cart"
                : "Event ticket added to cart";
              toast.success(successMessage);
              dispatch(fetchCart()); // Refresh cart data
              router.push('/cart'); // Redirect to cart page
            }
          })
          .catch((error) => {
            console.error(`Error adding ${type} to cart:`, error);
            toast.error(error?.message || error?.response?.data?.message || `Failed to add ${type} to cart`);
          });
      }
    } catch (error) {
      console.error('Error in payment option selection:', error);
      toast.error('An unexpected error occurred');
    }
  };

  if (!isOpen) return null;

  const itemName = tournament?.name || 'Item';
  const itemPrice = tournament?.ticket_price || 0;
  const itemType = type === 'tournament' ? 'tournament' : 'event';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-full shadow-lg mx-4">
        {/* Step 1: User Type Selection */}
        {step === 1 && (
          <>
            <h2 className="text-white text-2xl font-bold mb-4">Register for {itemType}</h2>
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">{itemName}</h3>
              <p className="text-gray-300">Price: ${itemPrice}</p>
            </div>

            <p className="text-white mb-6">How would you like to register?</p>

            <div className="flex flex-col gap-4 mb-6">
              <button
                onClick={() => handleUserTypeSelect('user')}
                className="flex items-center gap-3 p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors"
              >
                <div className="w-5 h-5 rounded-full border-2 border-white"></div>
                <span className="text-white font-medium">I have an account</span>
              </button>

              <button
                onClick={() => handleUserTypeSelect('guest')}
                className="flex items-center gap-3 p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors"
              >
                <div className="w-5 h-5 rounded-full border-2 border-white"></div>
                <span className="text-white font-medium">Continue as guest</span>
              </button>
            </div>
          </>
        )}

        {/* Step 2: Guest Details Form */}
        {step === 2 && (
          <>
            <h2 className="text-white text-2xl font-bold mb-4">Guest Registration</h2>
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">{itemName}</h3>
              <p className="text-gray-300">Price: ${itemPrice}</p>
            </div>

            <form onSubmit={handleGuestDetailsSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="guest_name"
                  value={guestData.guest_name}
                  onChange={handleGuestDataChange}
                  className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="guest_email"
                  value={guestData.guest_email}
                  onChange={handleGuestDataChange}
                  className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="guest_phone"
                  value={guestData.guest_phone}
                  onChange={handleGuestDataChange}
                  className="w-full p-3 rounded-lg bg-[#2A2A2A] text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Continue
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Payment Options */}
        {step === 3 && (
          <>
            <h2 className="text-white text-2xl font-bold mb-4">Payment Options</h2>
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">{itemName}</h3>
              <p className="text-gray-300">Price: ${itemPrice}</p>
              {userType === 'guest' && (
                <p className="text-blue-400 text-sm mt-1">Registering as: {guestData.guest_name}</p>
              )}
            </div>

            <p className="text-white mb-6">
              How would you like to pay for this {itemType}?
            </p>

            <div className="flex flex-col gap-4 mb-6">
          <div 
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
              paymentChoice === 'online' 
                ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]' 
                : 'bg-[#2A2A2A] hover:bg-[#3A3A3A]'
            }`}
            onClick={() => handlePaymentChoiceChange('online')}
          >
            <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
              paymentChoice === 'online' ? 'bg-white' : ''
            }`}>
              {paymentChoice === 'online' && <div className="w-3 h-3 rounded-full bg-[#5A79FB]"></div>}
            </div>
            <span className="text-white font-medium">Pay Online Now (${itemPrice})</span>
          </div>
          
          <div 
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
              paymentChoice === 'at_event' 
                ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]' 
                : 'bg-[#2A2A2A] hover:bg-[#3A3A3A]'
            }`}
            onClick={() => handlePaymentChoiceChange('at_event')}
          >
            <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
              paymentChoice === 'at_event' ? 'bg-white' : ''
            }`}>
              {paymentChoice === 'at_event' && <div className="w-3 h-3 rounded-full bg-[#5A79FB]"></div>}
            </div>
            <span className="text-white font-medium">Pay at the {itemType === 'tournament' ? 'Tournament' : 'Event'} (${itemPrice})</span>
          </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => userType === 'guest' ? setStep(2) : setStep(1)}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
          {paymentChoice === 'online' ? (
            <>
              <button
                onClick={handlePaymentOptionSelect}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  // Add to cart and redirect to checkout for immediate payment
                  handlePaymentOptionSelect();
                  setTimeout(() => {
                    router.push('/checkout');
                  }, 1000);
                }}
                className="flex-1 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Pay Now
              </button>
            </>
          ) : (
              <button
                onClick={handlePaymentOptionSelect}
                className="flex-1 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Register
              </button>
            )}
            </div>
          </>
        )}

        {/* Close button for all steps */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PaymentOptionsModal;
