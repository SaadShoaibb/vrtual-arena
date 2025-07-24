'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import BookingCalendar from '../BookingCalendar';
import Form from '../common/Form';
import FieldContainer from '../common/FieldContainer';
import Input from '../common/Input';
import Select from '../common/Select';
import { FaUser, FaUserPlus, FaCalendarCheck, FaCreditCard } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const MODE = {
    SESSION_SELECTION: "SESSION_SELECTION",
    CALENDAR: "CALENDAR",
    USER_TYPE: "USER_TYPE",
    GUEST_DETAILS: "GUEST_DETAILS",
    CONFIRMATION: "CONFIRMATION",
    PAYMENT_METHOD: "PAYMENT_METHOD",
    SUCCESS: "SUCCESS"
};

const EnhancedBookingForm = ({ onClose, locale = 'en', translations: t }) => {
    const [mode, setMode] = useState(MODE.SESSION_SELECTION);
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [userType, setUserType] = useState(''); // 'registered' or 'guest'
    const [paymentMethod, setPaymentMethod] = useState(''); // 'online' or 'at_venue'
    const [loading, setLoading] = useState(false);
    const [sessionCount, setSessionCount] = useState(1); // Number of sessions
    const [playerCount, setPlayerCount] = useState(1); // Number of players
    
    const { userData } = useSelector((state) => state.userData);
    const isLoggedIn = !!userData?.user_id;

    // Guest booking form data
    const [guestData, setGuestData] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: ''
    });

    // Fetch available sessions
    useEffect(() => {
        setLoading(true);
        fetchSessions().finally(() => setLoading(false));
    }, []);

    // Expose back navigation to parent component via global function
    useEffect(() => {
        window.bookingFormBackNavigation = handleBackNavigation;
        return () => {
            delete window.bookingFormBackNavigation;
        };
    }, [mode, userType]);

    // Calculate dynamic pricing based on pricing calculator logic with group discounts
    const calculatePrice = (session, sessionCount, playerCount) => {
        if (!session) return 0;

        // Pricing calculator logic - exact same as pricing calculator
        const pricingMap = {
            'Free Roaming Arena': { price1: 12, price2: 20 },
            'UFO Spaceship Cinema': { price1: 9, price2: 15 },
            'VR 360': { price1: 9, price2: 15 },
            'VR Battle': { price1: 9, price2: 15 },
            'VR Warrior': { price1: 7, price2: 12 },
            'VR Cat': { price1: 6, price2: 10 },
            'Photo Booth': { price1: 6, price2: 6 } // Photo booth has same price for both
        };

        const pricing = pricingMap[session.name];
        if (!pricing) {
            // Fallback to session price if not in pricing map
            return (session.price || 0) * sessionCount * playerCount;
        }

        const basePrice = sessionCount === 1 ? pricing.price1 : pricing.price2;
        let totalPrice = basePrice * playerCount;

        // Apply group discounts (All Tax Included)
        let discountPercent = 0;
        if (playerCount >= 20) {
            discountPercent = 20; // 20+ people: 20% off
        } else if (playerCount >= 10) {
            discountPercent = 15; // 10-19 people: 15% off
        } else if (playerCount >= 5) {
            discountPercent = 10; // 5-9 people: 10% off
        }

        const discountAmount = (totalPrice * discountPercent) / 100;
        return totalPrice - discountAmount;
    };

    // Get applied discount info for display
    const getDiscountInfo = (playerCount) => {
        if (playerCount >= 20) {
            return { name: '20+ people', discount: 20 };
        } else if (playerCount >= 10) {
            return { name: '10-19 people', discount: 15 };
        } else if (playerCount >= 5) {
            return { name: '5-9 people', discount: 10 };
        }
        return null;
    };

    const fetchSessions = async () => {
        try {
            console.log('Fetching sessions from:', `${API_URL}/user/get-sessions`);
            const response = await axios.get(`${API_URL}/user/get-sessions`);
            console.log('Sessions response:', response.data);

            if (response.data.success) {
                setSessions(response.data.sessions);
                console.log('Sessions loaded successfully:', response.data.sessions.length);
            } else {
                console.error('Sessions API returned success: false');
                toast.error('Failed to load sessions - API error');
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            console.error('Error details:', error.response?.data);
            toast.error(`Failed to load sessions: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleSessionSelect = (sessionId) => {
        const session = sessions.find(s => s.session_id === parseInt(sessionId));
        setSelectedSession(session);
        setMode(MODE.CALENDAR);
    };

    const handleTimeSlotSelect = (timeSlotData) => {
        setSelectedTimeSlot(timeSlotData);
        setMode(MODE.USER_TYPE);
    };

    const handleUserTypeSelect = (type) => {
        setUserType(type);
        if (type === 'guest') {
            setMode(MODE.GUEST_DETAILS);
        } else {
            setMode(MODE.CONFIRMATION);
        }
    };

    const handleGuestDataChange = (e) => {
        const { name, value } = e.target;
        setGuestData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGuestDetailsSubmit = (e) => {
        e.preventDefault();
        if (!guestData.guest_name || !guestData.guest_email) {
            toast.error('Please fill in all required fields');
            return;
        }
        setMode(MODE.CONFIRMATION);
    };

    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
        setMode(MODE.CONFIRMATION);
    };

    // Handle back navigation
    const handleBackNavigation = () => {
        switch (mode) {
            case MODE.CALENDAR:
                setMode(MODE.SESSION_SELECTION);
                break;
            case MODE.USER_TYPE:
                setMode(MODE.CALENDAR);
                break;
            case MODE.GUEST_DETAILS:
                setMode(MODE.USER_TYPE);
                break;
            case MODE.PAYMENT_METHOD:
                setMode(userType === 'guest' ? MODE.GUEST_DETAILS : MODE.USER_TYPE);
                break;
            case MODE.CONFIRMATION:
                setMode(userType === 'guest' ? MODE.GUEST_DETAILS : MODE.USER_TYPE);
                break;
            case MODE.SUCCESS:
                onClose();
                break;
            default:
                onClose();
        }
    };

    const handleBookingConfirm = async (selectedPaymentMethod) => {
        setLoading(true);
        try {
            let response;

            if (userType === 'guest') {
                // Create guest booking
                response = await axios.post(`${API_URL}/user/guest-booking`, {
                    session_id: selectedSession.session_id,
                    machine_type: selectedSession.name,
                    start_time: selectedTimeSlot.startTime,
                    end_time: selectedTimeSlot.endTime,
                    guest_name: guestData.guest_name,
                    guest_email: guestData.guest_email,
                    guest_phone: guestData.guest_phone,
                    payment_status: selectedPaymentMethod === 'online' ? 'pending' : 'pending',
                    payment_method: selectedPaymentMethod,
                    session_count: sessionCount,
                    player_count: playerCount,
                    total_amount: calculatePrice(selectedSession, sessionCount, playerCount)
                });
            } else {
                // Create registered user booking
                response = await axios.post(`${API_URL}/user/book-session`, {
                    session_id: selectedSession.session_id,
                    machine_type: selectedSession.name,
                    start_time: selectedTimeSlot.startTime,
                    end_time: selectedTimeSlot.endTime,
                    payment_status: selectedPaymentMethod === 'online' ? 'pending' : 'pending',
                    payment_method: selectedPaymentMethod,
                    session_count: sessionCount,
                    player_count: playerCount,
                    total_amount: calculatePrice(selectedSession, sessionCount, playerCount)
                }, getAuthHeaders());
            }

            if (response.data.success) {
                const booking = response.data.booking;

                if (selectedPaymentMethod === 'online') {
                    // Create Stripe checkout session
                    toast.success('Booking created! Redirecting to payment...');
                    await handleStripeCheckout(booking);
                } else {
                    // Pay at venue
                    toast.success('Booking confirmed! Payment will be collected at the venue.');
                    setMode(MODE.SUCCESS);
                }
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            toast.error(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    const handleStripeCheckout = async (booking) => {
        try {
            const stripe = await stripePromise;

            // Create checkout session
            const checkoutResponse = await axios.post(
                `${API_URL}/payment/create-checkout-session`,
                {
                    user_id: userType === 'guest' ? 0 : userData?.user_id,
                    amount: calculatePrice(selectedSession, sessionCount, playerCount),
                    entity_type: 'booking',
                    entity_id: booking.booking_id,
                },
                userType === 'guest' ? {} : getAuthHeaders()
            );

            const { sessionId } = checkoutResponse.data;

            // Redirect to Stripe checkout
            const { error } = await stripe.redirectToCheckout({
                sessionId,
            });

            if (error) {
                console.error('Stripe checkout error:', error);
                toast.error('Payment failed: ' + error.message);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            toast.error('Failed to initialize payment: ' + (error.response?.data?.message || error.message));
        }
    };

    const sessionOptions = sessions.map(session => ({
        value: session.session_id,
        label: `${session.name} - $${session.price} (${session.duration_minutes} min)`
    }));

    const renderSessionSelection = () => (
        <div className="text-white">
            <h1 className="text-4xl font-bold text-center mb-4">{t?.bookVrSession || 'Book VR Session'}</h1>
            <p className="text-lg text-center mb-8">{t?.chooseVrExperience || 'Choose your VR experience'}</p>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4">{t?.loadingSessions || 'Loading sessions...'}</p>
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">{t?.noSessionsAvailable || 'No VR sessions available at the moment.'}</p>
                    <button
                        onClick={fetchSessions}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200"
                    >
                        {t?.retryLoadingSessions || 'Retry Loading Sessions'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {sessions.map(session => (
                        <div
                            key={session.session_id}
                            onClick={() => handleSessionSelect(session.session_id)}
                            className="bg-blackish border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-purple-500 transition-all duration-200"
                        >
                            <h3 className="text-xl font-bold mb-2">{session.name}</h3>
                            <p className="text-gray-300 mb-3">{session.description}</p>
                            <div className="flex justify-between items-center">
                                <div className="text-left">
                                    {session.name === 'Photo Booth' ? (
                                        <span className="text-2xl font-bold text-green-400">$6 per session</span>
                                    ) : (
                                        <div>
                                            <div className="text-lg font-bold text-green-400">
                                                1 session: ${session.name === 'Free Roaming Arena' ? '12' :
                                                            session.name === 'UFO Spaceship Cinema' ? '9' :
                                                            session.name === 'VR 360' ? '9' :
                                                            session.name === 'VR Battle' ? '9' :
                                                            session.name === 'VR Warrior' ? '7' :
                                                            session.name === 'VR Cat' ? '6' : '0'}
                                            </div>
                                            <div className="text-lg font-bold text-green-400">
                                                2 sessions: ${session.name === 'Free Roaming Arena' ? '20' :
                                                             session.name === 'UFO Spaceship Cinema' ? '15' :
                                                             session.name === 'VR 360' ? '15' :
                                                             session.name === 'VR Battle' ? '15' :
                                                             session.name === 'VR Warrior' ? '12' :
                                                             session.name === 'VR Cat' ? '10' : '0'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-400">
                                        Max {session.max_players} {session.name === 'UFO Spaceship Cinema' ? 'seats' :
                                             session.name === 'VR 360' ? 'seats' :
                                             session.name === 'Free Roaming Arena' ? 'players' : 'players'}
                                    </div>
                                    <div className="text-sm text-yellow-400 mt-1">
                                        {t?.groupDiscountInfo || 'Group discounts: 5+ people get 10-20% off'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderCalendar = () => (
        <div>
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setMode(MODE.SESSION_SELECTION)}
                    className="text-purple-400 hover:text-purple-300"
                >
                    {t?.backToSessions || '← Back to Sessions'}
                </button>
                <h2 className="text-2xl font-bold text-white">
                    {selectedSession?.name}
                </h2>
            </div>
            <BookingCalendar
                selectedSession={selectedSession}
                onTimeSlotSelect={handleTimeSlotSelect}
            />
        </div>
    );

    const renderUserTypeSelection = () => (
        <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">{t?.bookingConfiguration || 'Booking Configuration'}</h1>
            <p className="text-lg mb-8">{t?.customizeVrExperience || 'Customize your VR experience'}</p>

            {/* Session and Player Count Controls */}
            <div className="bg-blackish border border-gray-700 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-4 text-white">{t?.sessionDetails || 'Session Details'}</h3>

                {/* Session Count */}
                {selectedSession?.name !== 'Photo Booth' && (
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-3">{t?.numberOfSessions || 'Number of Sessions:'}</label>
                        <div className="flex items-center gap-4 justify-center">
                            <button
                                onClick={() => setSessionCount(1)}
                                className={`px-6 py-3 rounded-lg transition-all ${
                                    sessionCount === 1
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                1 {t?.session || 'Session'} - ${calculatePrice(selectedSession, 1, 1)} {t?.perPerson || 'per person'}
                            </button>
                            <button
                                onClick={() => setSessionCount(2)}
                                className={`px-6 py-3 rounded-lg transition-all ${
                                    sessionCount === 2
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                2 {t?.sessions || 'Sessions'} - ${calculatePrice(selectedSession, 2, 1)} {t?.perPerson || 'per person'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Player Count */}
                <div className="mb-6">
                    <label className="block text-gray-300 mb-3">{t?.numberOfPlayers || 'Number of Players:'}</label>
                    <div className="flex items-center gap-4 justify-center">
                        <button
                            onClick={() => setPlayerCount(Math.max(1, playerCount - 1))}
                            className="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-600 disabled:opacity-50"
                            disabled={playerCount <= 1}
                        >
                            -
                        </button>
                        <div className="text-center">
                            <input
                                type="number"
                                min="1"
                                max={selectedSession?.max_players || 10}
                                value={playerCount}
                                onChange={(e) => setPlayerCount(Math.min(selectedSession?.max_players || 10, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="bg-gray-800 text-white text-center w-20 py-3 rounded-lg text-lg font-bold"
                            />
                            <div className="text-gray-400 text-sm mt-1">
                                {t?.maxPlayers || 'Max'} {selectedSession?.max_players}
                            </div>
                        </div>
                        <button
                            onClick={() => setPlayerCount(Math.min(selectedSession?.max_players || 10, playerCount + 1))}
                            className="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-600 disabled:opacity-50"
                            disabled={playerCount >= (selectedSession?.max_players || 10)}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Price Display */}
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                    {(() => {
                        const basePrice = sessionCount === 1 ?
                            (selectedSession?.name === 'Free Roaming Arena' ? 12 :
                             selectedSession?.name === 'UFO Spaceship Cinema' ? 9 :
                             selectedSession?.name === 'VR 360' ? 9 :
                             selectedSession?.name === 'VR Battle' ? 9 :
                             selectedSession?.name === 'VR Warrior' ? 7 :
                             selectedSession?.name === 'VR Cat' ? 6 :
                             selectedSession?.name === 'Photo Booth' ? 6 : 0) :
                            (selectedSession?.name === 'Free Roaming Arena' ? 20 :
                             selectedSession?.name === 'UFO Spaceship Cinema' ? 15 :
                             selectedSession?.name === 'VR 360' ? 15 :
                             selectedSession?.name === 'VR Battle' ? 15 :
                             selectedSession?.name === 'VR Warrior' ? 12 :
                             selectedSession?.name === 'VR Cat' ? 10 :
                             selectedSession?.name === 'Photo Booth' ? 6 : 0);

                        const subtotal = basePrice * playerCount;
                        const discountInfo = getDiscountInfo(playerCount);
                        const finalPrice = calculatePrice(selectedSession, sessionCount, playerCount);

                        return (
                            <>
                                <div className="text-3xl font-bold text-green-400 mb-2">
                                    ${finalPrice.toFixed(2)}
                                </div>
                                <div className="text-gray-400 space-y-1">
                                    <div>
                                        ${basePrice} per person × {playerCount} players = ${subtotal.toFixed(2)}
                                    </div>
                                    {discountInfo && (
                                        <div className="text-green-400 font-semibold">
                                            Group Discount ({discountInfo.name}): -{discountInfo.discount}% off
                                        </div>
                                    )}
                                    {selectedSession?.name !== 'Photo Booth' && (
                                        <div className="text-sm">
                                            {sessionCount} session{sessionCount > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>

            {/* User Type Selection */}
            <h3 className="text-xl font-bold mb-4">{t?.howToBook || 'How would you like to book?'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {isLoggedIn && (
                    <button
                        onClick={() => handleUserTypeSelect('registered')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                        <FaUser className="text-4xl mb-4 mx-auto" />
                        <h3 className="text-xl font-bold mb-2">{t?.continueAs || 'Continue as'} {userData.name}</h3>
                        <p className="text-gray-200">{t?.useAccountFasterBooking || 'Use your account for faster booking'}</p>
                    </button>
                )}
                
                <button
                    onClick={() => handleUserTypeSelect('guest')}
                    className="bg-gradient-to-r from-green-600 to-teal-600 p-8 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200"
                >
                    <FaUserPlus className="text-4xl mb-4 mx-auto" />
                    <h3 className="text-xl font-bold mb-2">{t?.bookAsGuest || 'Book as Guest'}</h3>
                    <p className="text-gray-200">{t?.noAccountRequired || 'No account required'}</p>
                </button>
            </div>
            
            <button
                onClick={() => setMode(MODE.CALENDAR)}
                className="mt-6 text-purple-400 hover:text-purple-300"
            >
                {t?.backToCalendar || '← Back to Calendar'}
            </button>
        </div>
    );

    const renderGuestDetails = () => (
        <div className="text-white">
            <h1 className="text-4xl font-bold text-center mb-4">{t?.guestDetails || 'Guest Details'}</h1>
            <p className="text-lg text-center mb-8">{t?.provideContactInfo || 'Please provide your contact information'}</p>
            
            <Form onSubmit={handleGuestDetailsSubmit} className="max-w-md mx-auto">
                <FieldContainer label={`${t?.fullName || 'Full Name'} *`} htmlFor="guest_name">
                    <Input
                        type="text"
                        name="guest_name"
                        value={guestData.guest_name}
                        onChange={handleGuestDataChange}
                        placeholder={t?.enterFullName || "Enter your full name"}
                        required
                    />
                </FieldContainer>

                <FieldContainer label={`${t?.email || 'Email Address'} *`} htmlFor="guest_email">
                    <Input
                        type="email"
                        name="guest_email"
                        value={guestData.guest_email}
                        onChange={handleGuestDataChange}
                        placeholder={t?.enterEmail || "Enter your email"}
                        required
                    />
                </FieldContainer>

                <FieldContainer label={t?.phonePlaceholder?.replace('*', '') || 'Phone Number'} htmlFor="guest_phone">
                    <Input
                        type="tel"
                        name="guest_phone"
                        value={guestData.guest_phone}
                        onChange={handleGuestDataChange}
                        placeholder={t?.enterPhoneNumber || "Enter your phone number"}
                    />
                </FieldContainer>
                
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                >
                    {t?.continueToConfirmation || 'Continue to Confirmation'}
                </button>
            </Form>
            
            <button
                onClick={() => setMode(MODE.USER_TYPE)}
                className="mt-4 text-purple-400 hover:text-purple-300 block mx-auto"
            >
                {t?.back || '← Back'}
            </button>
        </div>
    );

    const renderConfirmation = () => (
        <div className="text-white">
            <h1 className="text-4xl font-bold text-center mb-8">
                <FaCalendarCheck className="inline mr-3" />
                {t?.confirmBookingPayment || 'Confirm Booking & Payment'}
            </h1>

            <div className="bg-blackish border border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-white">{t?.bookingDetails || 'Booking Details'}</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-300">{t?.session || 'Session:'}</span>
                        <span className="font-semibold text-white">{selectedSession?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">{t?.date || 'Date:'}</span>
                        <span className="font-semibold text-white">
                            {new Date(selectedTimeSlot?.startTime).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">{t?.time || 'Time:'}</span>
                        <span className="font-semibold text-white">
                            {new Date(selectedTimeSlot?.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -
                            {new Date(selectedTimeSlot?.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-300">{t?.sessions || 'Sessions:'}</span>
                        <span className="font-semibold text-white">{sessionCount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">{t?.players || 'Players:'}</span>
                        <span className="font-semibold text-white">{playerCount}</span>
                    </div>

                    {/* Pricing Breakdown */}
                    {(() => {
                        const basePrice = sessionCount === 1 ?
                            (selectedSession?.name === 'Free Roaming Arena' ? 12 :
                             selectedSession?.name === 'UFO Spaceship Cinema' ? 9 :
                             selectedSession?.name === 'VR 360' ? 9 :
                             selectedSession?.name === 'VR Battle' ? 9 :
                             selectedSession?.name === 'VR Warrior' ? 7 :
                             selectedSession?.name === 'VR Cat' ? 6 :
                             selectedSession?.name === 'Photo Booth' ? 6 : 0) :
                            (selectedSession?.name === 'Free Roaming Arena' ? 20 :
                             selectedSession?.name === 'UFO Spaceship Cinema' ? 15 :
                             selectedSession?.name === 'VR 360' ? 15 :
                             selectedSession?.name === 'VR Battle' ? 15 :
                             selectedSession?.name === 'VR Warrior' ? 12 :
                             selectedSession?.name === 'VR Cat' ? 10 :
                             selectedSession?.name === 'Photo Booth' ? 6 : 0);

                        const subtotal = basePrice * playerCount;
                        const discountInfo = getDiscountInfo(playerCount);
                        const finalPrice = calculatePrice(selectedSession, sessionCount, playerCount);

                        return (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">{t?.pricePerPerson || 'Price per person:'}</span>
                                    <span className="font-semibold text-white">${basePrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">{t?.subtotal || 'Subtotal:'}</span>
                                    <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                {discountInfo && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">{t?.groupDiscount || 'Group Discount'} ({discountInfo.name}):</span>
                                        <span className="font-semibold text-green-400">-{discountInfo.discount}%</span>
                                    </div>
                                )}
                                <hr className="border-gray-700" />
                                <div className="flex justify-between">
                                    <span className="text-gray-300 font-bold">{t?.totalPrice || 'Total Price:'}</span>
                                    <span className="font-bold text-green-400 text-xl">${finalPrice.toFixed(2)}</span>
                                </div>
                            </>
                        );
                    })()}
                    {userType === 'guest' && (
                        <>
                            <hr className="border-gray-700" />
                            <div className="flex justify-between">
                                <span className="text-gray-300">{t?.name || 'Name:'}</span>
                                <span className="font-semibold text-white">{guestData.guest_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-300">{t?.email || 'Email:'}</span>
                                <span className="font-semibold text-white">{guestData.guest_email}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-blackish border border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-white">{t?.paymentMethod || 'Payment Method'}</h3>
                <p className="text-gray-300 mb-6">{t?.howToPay || 'How would you like to pay for this VR session?'}</p>

                <div className="flex flex-col gap-4 mb-6">
                    <div
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                            paymentMethod === 'online'
                                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500'
                                : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setPaymentMethod('online')}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                            paymentMethod === 'online' ? 'bg-purple-600' : 'bg-transparent'
                        }`}>
                            {paymentMethod === 'online' && <div className="w-3 h-3 rounded-full bg-white"></div>}
                        </div>
                        <div className="flex-1">
                            <span className="text-white font-medium block">{t?.payOnlineNow || '💳 Pay Online Now'}</span>
                            <span className="text-gray-400 text-sm">{t?.securePaymentStripe || 'Secure payment with Stripe'}</span>
                        </div>
                        <span className="text-green-400 font-bold">${selectedSession?.price}</span>
                    </div>

                    <div
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                            paymentMethod === 'at_venue'
                                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500'
                                : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setPaymentMethod('at_venue')}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                            paymentMethod === 'at_venue' ? 'bg-purple-600' : 'bg-transparent'
                        }`}>
                            {paymentMethod === 'at_venue' && <div className="w-3 h-3 rounded-full bg-white"></div>}
                        </div>
                        <div className="flex-1">
                            <span className="text-white font-medium block">{t?.payAtVenue || '🏢 Pay at the Venue'}</span>
                            <span className="text-gray-400 text-sm">{t?.payAtVenueDesc || 'Pay with cash or card when you arrive'}</span>
                        </div>
                        <span className="text-green-400 font-bold">${selectedSession?.price}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setMode(userType === 'guest' ? MODE.GUEST_DETAILS : MODE.USER_TYPE)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
                >
                    {t?.back || 'Back'}
                </button>
                <button
                    onClick={() => handleBookingConfirm(paymentMethod)}
                    disabled={loading || !paymentMethod}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                    {loading ? (t?.creatingBooking || 'Creating Booking...') : paymentMethod === 'online' ? (t?.proceedToPayment || 'Proceed to Payment') : (t?.confirmBooking || 'Confirm Booking')}
                </button>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="text-white text-center">
            <div className="text-6xl text-green-400 mb-6">✓</div>
            <h1 className="text-4xl font-bold mb-4">{t?.bookingConfirmed || 'Booking Confirmed!'}</h1>
            <p className="text-lg mb-8">
                {t?.vrSessionBooked || 'Your VR session has been successfully booked.'}
                {userType === 'guest' && ` ${t?.confirmationEmailSent || 'A confirmation email has been sent to your email address.'}`}
            </p>

            <button
                onClick={onClose}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
            >
                {t?.close || 'Close'}
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            {mode === MODE.SESSION_SELECTION && renderSessionSelection()}
            {mode === MODE.CALENDAR && renderCalendar()}
            {mode === MODE.USER_TYPE && renderUserTypeSelection()}
            {mode === MODE.GUEST_DETAILS && renderGuestDetails()}
            {mode === MODE.CONFIRMATION && renderConfirmation()}
            {mode === MODE.SUCCESS && renderSuccess()}
        </div>
    );
};

export default EnhancedBookingForm;
