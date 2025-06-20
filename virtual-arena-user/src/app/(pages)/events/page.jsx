'use client';
import React, { useEffect, useState } from 'react';
import MainLayout from '@/app/components/MainLayout';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice';
import { fetchUserData } from '@/Store/Actions/userActions';

const EventsPage = () => {
  const { t, locale } = useTranslation();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [paymentChoice, setPaymentChoice] = useState('online'); // 'online' or 'at_event'
  const { userData, isAuthenticated, registrations } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/get-tournaments`);
        setTournaments(response.data.tournaments || []);
      } catch (err) {
        setError(t.common?.error || 'Error fetching events');
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [t]);

  const handleRegisterClick = (tournament) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    
    if (registrations?.includes(tournament?.tournament_id)) {
      toast.error(t.alreadyRegistered || "You have already registered for this tournament");
      return;
    }
    
    // Show payment options instead of directly registering
    setSelectedTournament(tournament);
    setShowPaymentOptions(true);
  };

  const handlePaymentChoiceChange = (choice) => {
    setPaymentChoice(choice);
  };

  const handlePaymentOptionSelect = () => {
    try {
      if (!selectedTournament) {
        toast.error(t.selectTournament || "Please select a tournament first");
        return;
      }
      
      // Check for authentication token first
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        toast.error(t.loginRequired || "Please login to continue");
        setShowLogin(true);
        setShowPaymentOptions(false);
        return;
      }
      
      // Add tournament to cart with payment choice
      // Make sure we're not sending product_id for tournament items
      const payload = {
        tournament_id: selectedTournament.tournament_id,
        quantity: 1,
        item_type: 'tournament',
        payment_option: paymentChoice // Add payment option to cart item
      };
      
      // Log the payload for debugging
      console.log('Adding tournament to cart with payload:', payload);
      
      dispatch(addToCart(payload))
        .unwrap()
        .then((response) => {
          setShowPaymentOptions(false);
          
          if (paymentChoice === 'at_event') {
            // For 'Pay at Event', show success message but don't redirect to cart
            toast.success(response?.message || t.registeredAtEvent || "You have been registered for the tournament. Payment will be collected at the event.");
            dispatch(fetchUserData()); // Refresh user data to update registrations
          } else {
            // For online payment, add to cart and redirect
            toast.success(t.addedToCart || "Tournament ticket added to cart");
            dispatch(fetchCart()); // Refresh cart data
            router.push('/cart'); // Redirect to cart page
          }
        })
        .catch((error) => {
          console.error('Error adding to cart:', error);
          
          // More detailed error handling
          if (error.response && error.response.data) {
            // API returned an error response
            console.error('Error response data:', error.response.data);
            const errorMessage = error.response.data.message || error.response.data.error || t.addToCartError || "Failed to add tournament to cart";
            toast.error(errorMessage);
          } else if (error.request) {
            // Request was made but no response received
            console.error('Error request:', error.request);
            toast.error(t.networkError || "Network error. Please check your connection.");
          } else if (error.message) {
            // Error setting up the request
            console.error('Error message:', error.message);
            toast.error(error.message || t.addToCartError || "Failed to add tournament to cart");
          } else {
            // Unknown error
            console.error('Unknown error:', error);
            toast.error(t.addToCartError || "Failed to add tournament to cart");
          }
        });
    } catch (err) {
      console.error('Exception in handlePaymentOptionSelect:', err);
      toast.error(t.generalError || "An unexpected error occurred");
    }
  };

  return (
    <MainLayout title={t.eventsParties || 'Events & Parties'}>
      <div className="w-full px-2 md:px-8 py-8 min-h-[60vh] bg-blackish">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">{t.eventsParties || 'Events & Parties'}</h1>
        {loading ? (
          <div className="text-center text-white">{t.common?.loading || 'Loading...'}</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : tournaments.length === 0 ? (
          <div className="text-center text-white">{t.common?.noEvents || 'No events found.'}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <div key={tournament.tournament_id} className="bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl p-6 flex flex-col justify-between shadow-lg">
                <h2 className="text-xl font-bold mb-2 text-white truncate">{tournament.name}</h2>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['startDate'] || 'Start Date'}:</span> {tournament.start_date?.slice(0, 10)}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['endDate'] || 'End Date'}:</span> {tournament.end_date?.slice(0, 10)}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['city'] || 'City'}:</span> {tournament.city}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['country'] || 'Country'}:</span> {tournament.country}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['state'] || 'State'}:</span> {tournament.state}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['ticketPrice'] || 'Ticket Price'}:</span> ${tournament.ticket_price}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['status'] || 'Status'}:</span> {tournament.status}
                </div>
                <button
                  className="mt-4 bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-200 transition"
                  onClick={() => handleRegisterClick(tournament)}
                >
                  {t.register || 'Register'}
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Payment Options Modal */}
        {showPaymentOptions && selectedTournament && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-full shadow-lg">
              <h2 className="text-white text-2xl font-bold mb-4">{t.paymentOptions || 'Payment Options'}</h2>
              <p className="text-white mb-6">{t.paymentOptionsMsg || 'How would you like to pay for this tournament?'}</p>
              
              <div className="flex flex-col gap-4 mb-6">
                <div 
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer ${paymentChoice === 'online' ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]' : 'bg-[#2A2A2A]'}`}
                  onClick={() => handlePaymentChoiceChange('online')}
                >
                  <div className={`w-5 h-5 rounded-full border-2 ${paymentChoice === 'online' ? 'border-white bg-white' : 'border-white'} flex items-center justify-center`}>
                    {paymentChoice === 'online' && <div className="w-3 h-3 rounded-full bg-[#5A79FB]"></div>}
                  </div>
                  <span className="text-white font-medium">{t.payOnlineNow || 'Pay Online Now'} (${selectedTournament.ticket_price})</span>
                </div>
                
                <div 
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer ${paymentChoice === 'at_event' ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]' : 'bg-[#2A2A2A]'}`}
                  onClick={() => handlePaymentChoiceChange('at_event')}
                >
                  <div className={`w-5 h-5 rounded-full border-2 ${paymentChoice === 'at_event' ? 'border-white bg-white' : 'border-white'} flex items-center justify-center`}>
                    {paymentChoice === 'at_event' && <div className="w-3 h-3 rounded-full bg-[#5A79FB]"></div>}
                  </div>
                  <span className="text-white font-medium">{t.payAtEvent || 'Pay at the Event'} (${selectedTournament.ticket_price})</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => setShowPaymentOptions(false)}
                  className="px-6 py-2 bg-[#2A2A2A] text-white rounded-full"
                >
                  {t.cancel || 'Cancel'}
                </button>
                <button 
                  onClick={handlePaymentOptionSelect}
                  className="px-6 py-2 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white rounded-full"
                >
                  {t.continue || 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-black">{t.login || 'Login'}</h2>
              <p className="mb-6 text-black">{t.loginPrompt || 'Please log in to register for events.'}</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowLogin(false)}
              >
                Ok
              </button>
            
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EventsPage;