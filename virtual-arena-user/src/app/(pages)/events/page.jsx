'use client';
import React, { useEffect, useState } from 'react';
import MainLayout from '@/app/components/MainLayout';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import PaymentOptionsModal from '@/app/components/PaymentOptionsModal';
import AuthModal from '@/app/components/AuthModal';
import SEOHead from '@/app/components/SEOHead';


const EventsPage = () => {
  const { t, locale } = useTranslation();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const { isAuthenticated, registrations } = useSelector((state) => state.userData);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/get-events`);
        setTournaments(response.data.events || []);
      } catch (err) {
        setError(t.common?.error || 'Error fetching events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [t]);

  const handleRegisterClick = (event) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    if (registrations?.includes(event?.event_id)) {
      toast.error(t.alreadyRegistered || "You have already registered for this event");
      return;
    }

    // Show payment options instead of directly registering
    setSelectedTournament(event);
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
      <SEOHead page="events" locale={locale} />
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
            {tournaments.map((event) => (
              <div key={event.event_id} className="bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] rounded-xl p-6 flex flex-col justify-between shadow-lg">
                <h2 className="text-xl font-bold mb-2 text-white truncate">{event.name}</h2>
                {event.description && (
                  <div className="text-white text-sm mb-2">
                    <span className="font-semibold">{t['description'] || 'Description'}:</span> {event.description}
                  </div>
                )}
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['eventType'] || 'Event Type'}:</span> {event.event_type}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['startDate'] || 'Start Date'}:</span> {event.start_date?.slice(0, 10)}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['endDate'] || 'End Date'}:</span> {event.end_date?.slice(0, 10)}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['city'] || 'City'}:</span> {event.city}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['country'] || 'Country'}:</span> {event.country}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['state'] || 'State'}:</span> {event.state}
                </div>
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['ticketPrice'] || 'Ticket Price'}:</span> ${event.ticket_price}
                </div>
                {event.max_participants && (
                  <div className="text-white text-sm mb-2">
                    <span className="font-semibold">{t['participants'] || 'Participants'}:</span> {event.registered_count || 0} / {event.max_participants}
                  </div>
                )}
                <div className="text-white text-sm mb-2">
                  <span className="font-semibold">{t['status'] || 'Status'}:</span> {event.status}
                </div>
                <button
                  className="mt-4 bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-200 transition"
                  onClick={() => handleRegisterClick(event)}
                  disabled={event.max_participants && event.registered_count >= event.max_participants}
                >
                  {event.max_participants && event.registered_count >= event.max_participants
                    ? t.eventFull || 'Event Full'
                    : t.register || 'Register'
                  }
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Payment Options Modal */}
        {showPaymentOptions && selectedTournament && (
          <PaymentOptionsModal
            isOpen={showPaymentOptions}
            onClose={() => setShowPaymentOptions(false)}
            tournament={selectedTournament}
            type="event"
          />
        )}
        {/* Auth Modal */}
        {showLogin && (
          <AuthModal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default EventsPage;