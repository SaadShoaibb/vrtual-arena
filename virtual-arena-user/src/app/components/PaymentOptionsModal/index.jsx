'use client'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice';
import { fetchUserData } from '@/Store/Actions/userActions';
import { useTranslation } from '@/app/hooks/useTranslation';

const PaymentOptionsModal = ({ isOpen, onClose, tournament, type = 'tournament' }) => {
  const [paymentChoice, setPaymentChoice] = useState('online');
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData } = useSelector((state) => state.userData);

  const handlePaymentChoiceChange = (choice) => {
    setPaymentChoice(choice);
  };

  const handlePaymentOptionSelect = () => {
    try {
      if (!tournament) {
        toast.error("Please select an item first");
        return;
      }
      
      // Check for authentication token first
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        toast.error("Please login to continue");
        onClose();
        return;
      }
      
      let payload;
      
      if (type === 'tournament') {
        payload = {
          tournament_id: tournament.tournament_id,
          quantity: 1,
          item_type: 'tournament',
          payment_option: paymentChoice
        };
      } else if (type === 'event') {
        payload = {
          event_id: tournament.event_id, // tournament variable contains event data when type is 'event'
          quantity: 1,
          item_type: 'event',
          payment_option: paymentChoice
        };
      }
      
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-full shadow-lg mx-4">
        <h2 className="text-white text-2xl font-bold mb-4">Payment Options</h2>
        <p className="text-white mb-6">
          How would you like to pay for this {itemType}?
        </p>
        
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-2">{itemName}</h3>
          <p className="text-gray-300">Price: ${itemPrice}</p>
        </div>
        
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
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Cancel
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
      </div>
    </div>
  );
};

export default PaymentOptionsModal;
