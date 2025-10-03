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
import { openModal, closeModal } from '@/Store/ReduxSlice/ModalSlice';
import { closeBookModal, openBookModal } from '@/Store/ReduxSlice/bookModalSlice';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const MODE = {
    SESSION_SELECTION: "SESSION_SELECTION",
    CONFIGURE_SESSION: "CONFIGURE_SESSION",
    CALENDAR: "CALENDAR",
    USER_TYPE: "USER_TYPE",
    GUEST_DETAILS: "GUEST_DETAILS",
    CONFIRMATION: "CONFIRMATION",
    PAYMENT_METHOD: "PAYMENT_METHOD",
    SUCCESS: "SUCCESS"
};

const EnhancedBookingForm = ({ onClose, locale = 'en', translations: t }) => {
    const dispatch = useDispatch();
    const [mode, setMode] = useState(MODE.SESSION_SELECTION);
    const [sessions, setSessions] = useState([]);
    const [selectedSessions, setSelectedSessions] = useState([]); // Array of selected sessions with time slots
    const [currentSessionSelection, setCurrentSessionSelection] = useState(null); // Currently being configured
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [userType, setUserType] = useState(''); // 'registered' or 'guest'
    const [paymentMethod, setPaymentMethod] = useState(''); // 'online' or 'at_venue'
    const [showUserTypeModal, setShowUserTypeModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sessionPricing, setSessionPricing] = useState({}); // Dynamic pricing from database
    const [groupDiscounts, setGroupDiscounts] = useState([]); // Dynamic discounts from database
    const [timePasses, setTimePasses] = useState([]); // Available time passes
    const [sessionCount, setSessionCount] = useState(1); // Number of sessions for current selection
    const [playerCount, setPlayerCount] = useState(1); // Number of players for current selection
    const [durationHours, setDurationHours] = useState(0.5); // Duration in hours for current selection
    const [bookingType, setBookingType] = useState('session'); // Always use 'session' for session-based booking

    const { userData } = useSelector((state) => state.userData);
    const isLoggedIn = !!userData?.user_id;

    // Guest booking form data
    const [guestData, setGuestData] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: ''
    });

    // Check for pending booking after login
    useEffect(() => {
        if (isLoggedIn) {
            const pendingBooking = localStorage.getItem('pendingBooking');
            if (pendingBooking) {
                try {
                    const bookingState = JSON.parse(pendingBooking);
                    // Check if the booking is not too old (less than 30 minutes)
                    if (Date.now() - bookingState.timestamp < 30 * 60 * 1000) {
                        // Close login modal and reopen booking modal
                        dispatch(closeModal());
                        setTimeout(() => {
                            // Restore the booking state (but not the time slot)
                            setCurrentSessionSelection(bookingState.currentSessionSelection);
                            setSessionCount(bookingState.sessionCount || 1);
                            setPlayerCount(bookingState.playerCount || 1);
                            setDurationHours(bookingState.durationHours || 0.5);
                            setBookingType(bookingState.bookingType || 'session');
                            setUserType('registered');
                            // Clear the old time slot and go back to calendar to reselect
                            setSelectedTimeSlot(null);
                            setMode(MODE.CALENDAR);
                            
                            // Reopen booking modal
                            dispatch(openBookModal());
                            
                            toast.success(t?.welcomeBackPleaseReselectTime || 'Welcome back! Please reselect your preferred time slot.');
                        }, 200);
                    }
                    // Clear the pending booking
                    localStorage.removeItem('pendingBooking');
                } catch (error) {
                    console.error('Error restoring booking state:', error);
                    localStorage.removeItem('pendingBooking');
                }
            }
        }
    }, [isLoggedIn]);

    // Fetch available sessions
    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchSessions(),
            fetchSessionPricing(),
            fetchGroupDiscounts(),
            fetchTimePasses()
        ]).finally(() => setLoading(false));
    }, []);

    // Refetch data every 10 seconds to get real-time updates for pricing changes
    useEffect(() => {
        const interval = setInterval(() => {
            fetchSessions();
            fetchSessionPricing();
            fetchGroupDiscounts();
            fetchTimePasses();
        }, 10000); // 10 seconds for faster pricing updates

        return () => clearInterval(interval);
    }, []);

    // Expose back navigation to parent component via global function
    useEffect(() => {
        window.bookingFormBackNavigation = handleBackNavigation;
        return () => {
            delete window.bookingFormBackNavigation;
        };
    }, [mode, userType]);

    // Enhanced scroll to top utility function
    const scrollToTop = () => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Enhanced scroll to top initiated');
        }

        // Multiple scroll targets for maximum compatibility
        const scrollTargets = [
            // Primary targets
            document.getElementById('booking-modal-container'),
            document.querySelector('[data-modal-content]'),
            document.querySelector('.modal-content'),

            // Secondary targets
            document.querySelector('.overflow-y-auto'),
            document.querySelector('.overflow-auto'),
            document.querySelector('.overflow-scroll'),

            // Parent containers
            document.querySelector('.fixed'),
            document.querySelector('.relative'),

            // Fallback targets
            document.body,
            document.documentElement
        ];

        let scrolled = false;

        // Try each target
        scrollTargets.forEach((target, index) => {
            if (target && !scrolled) {
                try {
                    if (target.scrollTo) {
                        target.scrollTo({ top: 0, behavior: 'smooth' });
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`✅ Scrolled target ${index} to top using scrollTo`);
                        }
                        scrolled = true;
                    } else {
                        target.scrollTop = 0;
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`✅ Scrolled target ${index} to top using scrollTop`);
                        }
                        scrolled = true;
                    }
                } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`❌ Failed to scroll target ${index}:`, error);
                    }
                }
            }
        });

        // Force scroll for mobile devices
        if (window.innerWidth <= 768) {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            window.scrollTo(0, 0);
            if (process.env.NODE_ENV === 'development') {
                console.log('📱 Applied mobile-specific scroll fixes');
            }
        }

        // Final fallback
        if (!scrolled) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (process.env.NODE_ENV === 'development') {
                console.log('🔄 Applied final fallback window scroll');
            }
        }
    };

    // Calculate base price per person (without discounts) - Session-based only
    const getBasePrice = (session, sessionCount, bookingType = 'session', durationHours = 1) => {
        if (!session) return 0;

        // For time-based booking, calculate based on hourly rate
        if (bookingType === 'hourly' && session.hourly_rate) {
            return Number(session.hourly_rate * durationHours) || 0;
        }

        // Use session count pricing from database first
        if (sessionPricing[session.session_id]) {
            const pricing = sessionPricing[session.session_id];
            const price = pricing[sessionCount];
            if (price !== undefined) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`💰 Database pricing for ${session.name} (${sessionCount} session(s)): $${price}`);
                }
                return Number(price) || 0;
            }
        }

        // Updated fallback pricing to match your exact requirements
        const fallbackPricing = {
            'Free-Roaming Arena': { price1: 12, price2: 20 },
            'Free Roaming Arena': { price1: 12, price2: 20 },
            'Free Roaming VR Arena 2.0': { price1: 12, price2: 20 },
            'UFO Spaceship Cinema': { price1: 9, price2: 15 },
            'VR UFO 5 Players': { price1: 9, price2: 15 },
            'VR 360': { price1: 9, price2: 15 },
            'VR 360° Motion Chair': { price1: 9, price2: 15 },
            'VR Battle': { price1: 9, price2: 15 },
            'VR Warrior': { price1: 7, price2: 12 },
            'VR Warrior 2players': { price1: 7, price2: 12 },
            'VR Cat': { price1: 6, price2: 10 },
            'VR CAT': { price1: 6, price2: 10 },
            'Photo Booth': { price1: 6, price2: 6 },
            'HTC VIVE VR Standing Platform': { price1: 9, price2: 15 }
        };

        const pricing = fallbackPricing[session.name];
        if (pricing) {
            const price = sessionCount === 1 ? pricing.price1 : pricing.price2;
            return Number(price) || 0;
        }

        // Final fallback to session.price
        return Number(session.price) || 0;
    };

    // Calculate total price with discounts - Session-based only
    const calculatePrice = (session, sessionCount, playerCount) => {
        if (!session) return 0;

        // For time passes, price is fixed per pass (no per-player pricing or discounts)
        if (session?.pass_type) {
            return session.price; // Time passes are per-pass, not per-player
        }

        const basePrice = getBasePrice(session, sessionCount) || 0;
        let totalPrice = basePrice * (playerCount || 1);

        // Apply dynamic group discounts
        const discount = getDiscountInfo(playerCount);
        if (discount) {
            const discountAmount = (totalPrice * discount.discount) / 100;
            totalPrice -= discountAmount;
        }

        return Number(totalPrice) || 0;
    };

    // Get applied discount info for display - use dynamic discounts
    const getDiscountInfo = (playerCount) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`💰 Checking discount for ${playerCount} players`);
            console.log('💰 Available discounts:', groupDiscounts);
        }

        // Sort discounts by min_players descending to check highest thresholds first
        const sortedDiscounts = [...groupDiscounts].sort((a, b) => b.min_players - a.min_players);

        if (process.env.NODE_ENV === 'development') {
            console.log('💰 Sorted discounts:', sortedDiscounts);
        }

        for (const discount of sortedDiscounts) {
            const meetsMin = playerCount >= discount.min_players;
            const meetsMax = discount.max_players === null || playerCount <= discount.max_players;

            if (process.env.NODE_ENV === 'development') {
                console.log(`💰 Checking discount: ${discount.discount_name} (${discount.min_players}-${discount.max_players || '∞'}) - Min: ${meetsMin}, Max: ${meetsMax}`);
            }

            if (meetsMin && meetsMax) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`💰 Applied discount: ${discount.discount_name} - ${discount.discount_percentage}%`);
                }
                return {
                    name: discount.discount_name,
                    discount: discount.discount_percentage
                };
            }
        }

        // Fallback to hardcoded discounts if no dynamic discounts loaded
        if (groupDiscounts.length === 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log('💰 Using fallback discounts');
            }
            if (playerCount >= 20) {
                return { name: '20+ people', discount: 20 };
            } else if (playerCount >= 10) {
                return { name: '10-19 people', discount: 15 };
            } else if (playerCount >= 5) {
                return { name: '5-9 people', discount: 10 };
            }
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('💰 No discount applied');
        }
        return null;
    };

    // Step indicator component
    const StepIndicator = () => {
        const steps = [
            { key: MODE.SESSION_SELECTION, label: t?.selectSession || 'Select Session', icon: '🎮' },
            { key: MODE.CONFIGURE_SESSION, label: t?.configureSession || 'Configure Session', icon: '⚙️' },
            { key: MODE.CALENDAR, label: t?.selectDateTime || 'Select Date & Time', icon: '📅' },
            { key: MODE.GUEST_DETAILS, label: t?.guestDetails || 'Guest Details', icon: '📝' },
            { key: MODE.CONFIRMATION, label: t?.confirmation || 'Confirmation', icon: '✅' },
            { key: MODE.SUCCESS, label: t?.success || 'Success', icon: '🎉' }
        ];

        const getCurrentStepIndex = () => {
            return steps.findIndex(step => step.key === mode);
        };

        const currentStepIndex = getCurrentStepIndex();

        return (
            <div className="mb-6 px-4">
                <div className="flex items-center justify-between md:justify-center md:space-x-8 overflow-x-auto">
                    {steps.map((step, index) => {
                        const isActive = index === currentStepIndex;
                        const isCompleted = index < currentStepIndex;
                        const isAccessible = index <= currentStepIndex;

                        return (
                            <div key={step.key} className="flex items-center min-w-0">
                                <div className="flex flex-col items-center">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                                        ${isActive ? 'bg-purple-600 text-white' :
                                          isCompleted ? 'bg-green-600 text-white' :
                                          'bg-gray-600 text-gray-300'}
                                        transition-all duration-200
                                    `}>
                                        {isCompleted ? '✓' : step.icon}
                                    </div>
                                    <span className={`
                                        text-xs mt-1 text-center max-w-[80px] leading-tight font-medium
                                        ${isActive ? 'text-purple-200 font-bold' :
                                          isCompleted ? 'text-green-200 font-semibold' :
                                          'text-gray-200'}
                                        hidden sm:block
                                    `}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`
                                        w-8 h-0.5 mx-2
                                        ${isCompleted ? 'bg-green-600' : 'bg-gray-600'}
                                        hidden md:block
                                    `} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Multiple session handling functions
    const addSessionToCart = () => {
        if (!currentSessionSelection || !selectedTimeSlot) {
            toast.error(t?.pleaseSelectSessionAndTime || 'Please select a session and time slot');
            return;
        }

        const sessionItem = {
            id: Date.now(), // Unique ID for this cart item
            session: currentSessionSelection,
            timeSlot: selectedTimeSlot,
            sessionCount: sessionCount,
            playerCount: playerCount,
            durationHours: durationHours,
            bookingType: bookingType,
            totalPrice: calculatePrice(currentSessionSelection, sessionCount, playerCount, bookingType, durationHours)
        };

        setSelectedSessions(prev => [...prev, sessionItem]);

        // Reset current selection
        setCurrentSessionSelection(null);
        setSelectedTimeSlot(null);
        setSessionCount(1);
        setPlayerCount(1);
        setDurationHours(0.25);
        setBookingType('session');
        setMode(MODE.SESSION_SELECTION);

        toast.success(t?.sessionAddedToCart || 'Session added to cart!');
    };

    const removeSessionFromCart = (sessionId) => {
        setSelectedSessions(prev => prev.filter(item => item.id !== sessionId));
        toast.success(t?.sessionRemovedFromCart || 'Session removed from cart');
    };

    const getTotalCartPrice = () => {
        return selectedSessions.reduce((total, item) => total + item.totalPrice, 0);
    };

    const proceedToBooking = () => {
        if (selectedSessions.length === 0) {
            toast.error(t?.pleaseAddSessionsToCart || 'Please add at least one session to your cart');
            return;
        }
        setMode(MODE.USER_TYPE);
        setTimeout(() => {
            const modalContainer = document.getElementById('booking-modal-container');
            console.log('🔄 Attempting to scroll, modal container:', modalContainer);
            if (modalContainer) {
                modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
                console.log('✅ Scrolled to top');
            } else {
                console.log('❌ Modal container not found');
                // Fallback to window scroll
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    };

    const fetchSessions = async () => {
        try {
            console.log('Fetching sessions from:', `${API_URL}/user/get-sessions`);
            const response = await axios.get(`${API_URL}/user/get-sessions`);
            console.log('Sessions response:', response.data);

            if (response.data.success) {
                // Filter out inactive sessions
                const activeSessions = response.data.sessions.filter(session => session.is_active);
                setSessions(activeSessions);
                console.log('Active sessions loaded successfully:', activeSessions.length);
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

    const fetchSessionPricing = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/sessions/public/pricing`);
            if (response.data.success) {
                // Convert array to object for easy lookup
                const pricingMap = {};
                response.data.pricing.forEach(item => {
                    if (!pricingMap[item.session_id]) {
                        pricingMap[item.session_id] = {};
                    }
                    pricingMap[item.session_id][item.session_count] = item.price;
                });
                setSessionPricing(pricingMap);

                if (process.env.NODE_ENV === 'development') {
                    console.log('💰 Session pricing loaded:', pricingMap);
                }
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error fetching session pricing:', error);
            }
        }
    };

    const fetchGroupDiscounts = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/sessions/public/group-discounts`);
            if (response.data.success) {
                const activeDiscounts = response.data.discounts.filter(d => d.is_active);
                setGroupDiscounts(activeDiscounts);

                if (process.env.NODE_ENV === 'development') {
                    console.log('💰 Fetched group discounts:', activeDiscounts);
                }
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error fetching group discounts:', error);
            }
        }
    };

    const fetchTimePasses = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/passes/public`);
            if (response.data.success) {
                setTimePasses(response.data.passes.filter(p => p.is_active));
            }
        } catch (error) {
            console.error('Error fetching time passes:', error);
        }
    };

    const handleSessionSelect = (sessionId) => {
        const session = sessions.find(s => s.session_id === parseInt(sessionId));
        setCurrentSessionSelection(session);

        // Set duration dynamically based on session duration
        // But don't override duration for time passes
        if (session && session.duration_minutes && !currentSessionSelection?.pass_type) {
            const sessionDurationHours = session.duration_minutes / 60;
            setDurationHours(sessionDurationHours);
        }

        // After selecting a session, go to configure session step
        setMode(MODE.CONFIGURE_SESSION);

        // Scroll to top after mode change
        setTimeout(() => {
            scrollToTop();
        }, 150);
    };

    const handleTimeSlotSelect = (timeSlotData) => {
        console.log('📅 Time slot selected:', timeSlotData);
        setSelectedTimeSlot(timeSlotData);

        // Handle multiple slots for time-based booking
        if (timeSlotData && timeSlotData.timeSlots && timeSlotData.timeSlots.length > 0) {
            console.log('🕐 Multiple time slots selected:', timeSlotData.timeSlots);
            setDurationHours(timeSlotData.duration || 1);
            // Don't auto-advance for multiple slot selection - let user continue selecting
            return;
        }

        // Do not auto-advance past the calendar here; user will continue manually
        // Keep the user on CALENDAR until they press Continue
        return;
    };

    const handleUserTypeSelect = (type) => {
        setShowUserTypeModal(false);
        
        if (type === 'guest') {
            setUserType(type);
            setMode(MODE.GUEST_DETAILS);
        } else {
            // Check if user is logged in
            if (!isLoggedIn) {
                // Save the current booking state to localStorage before closing
                const bookingState = {
                    currentSessionSelection,
                    selectedTimeSlot,
                    sessionCount,
                    playerCount,
                    durationHours,
                    bookingType,
                    mode: 'USER_TYPE_PENDING',
                    timestamp: Date.now()
                };
                localStorage.setItem('pendingBooking', JSON.stringify(bookingState));
                
                // Close the booking form modal and open login modal
                toast.error(t?.pleaseLoginToContinue || 'Please login to continue');
                dispatch(closeBookModal());
                setTimeout(() => {
                    dispatch(openModal('LOGIN'));
                }, 100);
                return;
            }
            setUserType(type);
            setMode(MODE.CONFIRMATION);
        }
        
        setTimeout(() => {
            const modalContainer = document.getElementById('booking-modal-container');
            console.log('🔄 Attempting to scroll, modal container:', modalContainer);
            if (modalContainer) {
                modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
                console.log('✅ Scrolled to top');
            } else {
                console.log('❌ Modal container not found');
                // Fallback to window scroll
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
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
            case MODE.CONFIGURE_SESSION:
                setMode(MODE.SESSION_SELECTION);
                break;
            case MODE.CALENDAR:
                setMode(MODE.CONFIGURE_SESSION);
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
                    session_id: currentSessionSelection.pass_type ? null : currentSessionSelection.session_id,
                    pass_id: currentSessionSelection.pass_type ? currentSessionSelection.pass_id : null,
                    booking_type: currentSessionSelection.pass_type ? 'pass' : bookingType,
                    duration_hours: currentSessionSelection.pass_type ? (currentSessionSelection.duration_minutes / 60) : durationHours,
                    machine_type: currentSessionSelection.name,
                    start_time: selectedTimeSlot.startTime,
                    end_time: selectedTimeSlot.endTime,
                    guest_name: guestData.guest_name,
                    guest_email: guestData.guest_email,
                    guest_phone: guestData.guest_phone,
                    payment_status: selectedPaymentMethod === 'online' ? 'pending' : 'pending',
                    payment_method: selectedPaymentMethod,
                    session_count: sessionCount,
                    player_count: playerCount,
                    total_amount: calculatePrice(currentSessionSelection, sessionCount, playerCount, bookingType, durationHours)
                });
            } else {
                // Create registered user booking
                response = await axios.post(`${API_URL}/user/book-session`, {
                    session_id: currentSessionSelection.pass_type ? null : currentSessionSelection.session_id,
                    pass_id: currentSessionSelection.pass_type ? currentSessionSelection.pass_id : null,
                    booking_type: currentSessionSelection.pass_type ? 'pass' : bookingType,
                    duration_hours: currentSessionSelection.pass_type ? (currentSessionSelection.duration_minutes / 60) : durationHours,
                    machine_type: currentSessionSelection.name,
                    start_time: selectedTimeSlot.startTime,
                    end_time: selectedTimeSlot.endTime,
                    payment_status: selectedPaymentMethod === 'online' ? 'pending' : 'pending',
                    payment_method: selectedPaymentMethod,
                    session_count: sessionCount,
                    player_count: playerCount,
                    total_amount: calculatePrice(currentSessionSelection, sessionCount, playerCount, bookingType, durationHours)
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
                    amount: calculatePrice(currentSessionSelection, sessionCount, playerCount, bookingType, durationHours),
                    currency: 'cad',
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

    // Helper function to get translated experience name
    const getTranslatedExperienceName = (sessionName) => {
        return t?.experienceNames?.[sessionName] || sessionName;
    };

    // Helper function to get translated experience description
    const getTranslatedExperienceDescription = (sessionName) => {
        return t?.experienceDescriptions?.[sessionName] || '';
    };

    const sessionOptions = sessions.map(session => ({
        value: session.session_id,
        label: `${getTranslatedExperienceName(session.name)} - $${session.price} (${session.duration_minutes} min)`
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
                <div className="space-y-6">


                    {/* Time Passes Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4">
                            {t?.timePasses || 'Time Passes'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {timePasses.map((pass) => (
                                <div
                                    key={pass.pass_id}
                                    className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400 transition-all duration-200 cursor-pointer"
                                    onClick={() => {
                                        setCurrentSessionSelection({
                                            session_id: null,
                                            pass_id: pass.pass_id,
                                            name: pass.name,
                                            price: pass.price,
                                            duration_minutes: pass.duration_hours * 60,
                                            duration_hours: pass.duration_hours,
                                            max_players: 1,
                                            pass_type: true
                                        });
                                        // Set duration for time passes
                                        setDurationHours(pass.duration_hours);
                                        // For time passes, go to calendar to select time slots
                                        setMode(MODE.CALENDAR);
                                        // Scroll to top
                                        setTimeout(() => {
                                            const modalContainer = document.getElementById('booking-modal-container');
                                            if (modalContainer) {
                                                modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
                                            } else {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                        }, 100);
                                    }}
                                >
                                    <div className="text-center">
                                        <h4 className="text-lg font-bold text-white mb-2">{pass.name}</h4>
                                        <div className="text-2xl font-bold text-green-400 mb-2">${pass.price}</div>
                                        <p className="text-gray-300 text-sm mb-3">{pass.description}</p>
                                        <div className="bg-green-900/30 rounded-lg p-2">
                                            <p className="text-green-400 text-xs font-semibold">
                                                ✨ {t?.unlimitedAccess || 'Unlimited access to all experiences'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Session Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">
                            {t?.selectVrExperience || 'Select VR Experience'}
                        </h3>
                        {sessions.map(session => (
                        <div
                            key={session.session_id}
                            onClick={() => handleSessionSelect(session.session_id)}
                            className="bg-blackish border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-purple-500 transition-all duration-200"
                        >
                            <h3 className="text-xl font-bold mb-2">{getTranslatedExperienceName(session.name)}</h3>
                            <p className="text-gray-300 mb-3">{getTranslatedExperienceDescription(session.name) || session.description}</p>
                            <div className="flex justify-between items-center">
                                <div className="text-left">
                                    <div>
                                        <div className="text-lg font-bold text-green-400">
                                            1 session: ${getBasePrice(session, 1)}
                                        </div>
                                        <div className="text-lg font-bold text-green-400">
                                            2 sessions: ${getBasePrice(session, 2)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-400">
                                        Max {session.max_players} {session.name === 'UFO Spaceship Cinema' ? (t?.seats || 'seats') :
                                             session.name === 'VR 360' ? (t?.seats || 'seats') :
                                             session.name === 'Free Roaming Arena' ? (t?.players || 'players') : (t?.players || 'players')}
                                    </div>
                                    <div className="text-sm text-yellow-400 mt-1">
                                        {t?.groupDiscountInfo || 'Group discounts: 5+ people get 10-20% off'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>


                </div>
            )}
        </div>
    );

    const renderTimePassSelection = () => {
        return (
            <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-4">{t?.selectTimePass || 'Select Time Pass'}</h1>
                <p className="text-lg mb-8">{t?.unlimitedAccess || 'Unlimited access to all VR experiences'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
                    {timePasses.map((pass) => (
                        <div
                            key={pass.pass_id}
                            className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400 transition-all duration-200 cursor-pointer"
                            onClick={() => {
                                setCurrentSessionSelection({
                                    session_id: null,
                                    pass_id: pass.pass_id,
                                    name: pass.name,
                                    price: pass.price,
                                    duration_minutes: pass.duration_hours * 60,
                                    duration_hours: pass.duration_hours,
                                    max_players: 1,
                                    pass_type: true
                                });
                                // Set duration for time passes
                                setDurationHours(pass.duration_hours);
                                // For time passes, go to calendar to select time slots
                                setMode(MODE.CALENDAR);
                                // Scroll to top
                                setTimeout(() => {
                                    const modalContainer = document.getElementById('booking-modal-container');
                                    if (modalContainer) {
                                        modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
                                    } else {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }, 100);
                            }}
                        >
                            <div className="text-center">
                                <div className="text-4xl mb-4">🎫</div>
                                <h3 className="text-xl font-bold text-white mb-2">{pass.name}</h3>
                                <div className="text-3xl font-bold text-green-400 mb-3">${pass.price}</div>
                                <div className="text-gray-300 text-sm mb-4">
                                    {pass.duration_hours} {pass.duration_hours === 1 ? (t?.hour || 'hour') : (t?.hours || 'hours')}
                                </div>
                                <p className="text-gray-400 text-xs">{pass.description}</p>
                                <div className="mt-4 p-3 bg-green-900/30 rounded-lg">
                                    <p className="text-green-400 text-sm font-semibold">
                                        ✨ {t?.unlimitedAccess || 'Unlimited Access'}
                                    </p>
                                    <p className="text-green-300 text-xs mt-1">
                                        {t?.allExperiences || 'All VR experiences included'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {timePasses.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">{t?.noPassesAvailable || 'No time passes available at the moment'}</p>
                    </div>
                )}
            </div>
        );
    };


    const renderConfigureSession = () => {
        if (!currentSessionSelection) {
            return (
                <div className="text-center py-8">
                    <div className="mb-6">
                        <div className="text-6xl mb-4">⚙️</div>
                        <h3 className="text-white text-xl font-bold mb-2">
                            {t?.configurationRequired || 'Configuration Required'}
                        </h3>
                        <p className="text-gray-300 mb-4">
                            {t?.pleaseSelectSessionFirst || 'Please select a session first'}
                        </p>
                    </div>
                    <button
                        onClick={() => setMode(MODE.SESSION_SELECTION)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                    >
                        {t?.backToSessions || 'Back to Sessions'}
                    </button>
                </div>
            );
        }

        return (
            <div className="text-white">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setMode(MODE.SESSION_SELECTION)}
                        className="text-purple-400 hover:text-purple-300"
                    >
                        {t?.backToSessions || '← Back to Sessions'}
                    </button>
                    <h2 className="text-2xl font-bold text-white">
                        {getTranslatedExperienceName(currentSessionSelection?.name)}
                    </h2>
                </div>

                {/* Session Configuration */}
                <div className="bg-blackish border border-gray-700 rounded-lg p-6 mb-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white text-center">{t?.configureSessions || 'Configure Sessions'}</h3>
                        <p className="text-gray-300 text-center mt-2">{t?.selectDurationAndPlayers || 'Select duration and number of players'}</p>
                    </div>

                    {/* Session Info */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                        <div className="text-center">
                            <h4 className="text-white font-semibold mb-2">{getTranslatedExperienceName(currentSessionSelection.name)}</h4>
                            <p className="text-gray-300 text-sm mb-2">
                                {t?.sessionDuration || 'Session Duration'}: {currentSessionSelection.duration_minutes} {t?.minutes || 'minutes'}
                            </p>
                            <p className="text-gray-300 text-sm">
                                {t?.sessionPrice || 'Session Price'}: ${getBasePrice(currentSessionSelection, 1)}
                            </p>
                        </div>
                    </div>

                    {/* Session Count Controls - Capped at 2 sessions */}
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-3">{t?.numberOfSessions || 'Number of Sessions:'}</label>
                        <div className="flex items-center gap-4 justify-center">
                            <button
                                onClick={() => setSessionCount(Math.max(1, sessionCount - 1))}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                disabled={sessionCount <= 1}
                            >
                                -
                            </button>
                            <div className="text-center">
                                <span className="text-white text-lg font-bold block">
                                    {sessionCount} {sessionCount === 1 ? (t?.session || 'session') : (t?.sessions || 'sessions')}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    ({sessionCount * currentSessionSelection.duration_minutes} {t?.minutes || 'minutes'} total)
                                </span>
                            </div>
                            <button
                                onClick={() => setSessionCount(Math.min(2, sessionCount + 1))}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                disabled={sessionCount >= 2}
                            >
                                +
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-gray-400 text-sm">
                                {t?.sessionRange || 'Choose 1 or 2 sessions'}
                            </span>
                        </div>
                    </div>

                    {/* Player Count */}
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-3">{t?.numberOfPlayers || 'Number of Players:'}</label>
                        <div className="flex items-center gap-4 justify-center">
                            <button
                                onClick={() => setPlayerCount(Math.max(1, playerCount - 1))}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                disabled={playerCount <= 1}
                            >
                                -
                            </button>
                            <span className="text-white text-lg font-bold min-w-[3rem] text-center">
                                {playerCount}
                            </span>
                            <button
                                onClick={() => setPlayerCount(Math.min(currentSessionSelection?.max_players || 10, playerCount + 1))}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                disabled={playerCount >= (currentSessionSelection?.max_players || 10)}
                            >
                                +
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-gray-400 text-sm">
                                Max {currentSessionSelection?.max_players} {t?.players || 'players'}
                            </span>
                        </div>
                    </div>

                    {/* Price Display with Discounts */}
                    <div className="bg-gray-800 rounded-lg p-4 text-center mb-6">
                        {(() => {
                            const basePrice = getBasePrice(currentSessionSelection, sessionCount);
                            const totalPrice = calculatePrice(currentSessionSelection, sessionCount, playerCount);
                            const discount = getDiscountInfo(playerCount);
                            const subtotal = basePrice * playerCount;
                            const discountAmount = subtotal - totalPrice;

                            return (
                                <div>
                                    <div className="mb-3">
                                        <p className="text-gray-300 text-sm">
                                            {t?.pricePerPerson || 'Price per person'}: ${basePrice.toFixed(2)}
                                        </p>
                                        <p className="text-gray-300 text-sm">
                                            {t?.subtotal || 'Subtotal'}: ${subtotal.toFixed(2)}
                                        </p>
                                        {discount && (
                                            <p className="text-green-400 text-sm">
                                                {t?.groupDiscount || 'Group Discount'} ({discount.name}): -{discount.discount}% (-${discountAmount.toFixed(2)})
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-2xl font-bold text-green-400">
                                        ${(totalPrice || 0).toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {sessionCount} {sessionCount === 1 ? (t?.session || 'session') : (t?.sessions || 'sessions')} × {playerCount} {t?.players || 'players'}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Continue Button */}
                    <div className="text-center">
                        <button
                            onClick={() => {
                                setMode(MODE.CALENDAR);
                                setTimeout(() => scrollToTop(), 100);
                            }}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                        >
                            {t?.continueToCalendar || 'Continue to Calendar'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderCalendar = () => {
        // For time passes, show pass selection instead of session selection
        if (bookingType === 'pass' && !currentSessionSelection) {
            return renderTimePassSelection();
        }

        // Only show calendar if a session is selected
        if (!currentSessionSelection) {
            return (
                <div className="text-center py-8">
                    <p className="text-white text-lg mb-4">
                        {t?.pleaseSelectSession || 'Please select a VR experience first'}
                    </p>
                    <button
                        onClick={() => setMode(MODE.SESSION_SELECTION)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                    >
                        {t?.selectSession || 'Select VR Experience'}
                    </button>
                </div>
            );
        }

        // Check if session configuration is complete
        const isConfigurationComplete = () => {
            if (bookingType === 'pass') {
                // Time passes don't need session selection or configuration
                return true;
            }
            if (!currentSessionSelection) return false;
            if (bookingType === 'session') {
                return sessionCount > 0 && playerCount > 0;
            } else if (bookingType === 'hourly') {
                return durationHours > 0 && playerCount > 0;
            }
            return false;
        };

        if (!isConfigurationComplete()) {
            return (
                <div className="text-center py-8">
                    <div className="mb-6">
                        <div className="text-6xl mb-4">⚙️</div>
                        <h3 className="text-white text-xl font-bold mb-2">
                            {t?.configurationRequired || 'Configuration Required'}
                        </h3>
                        <p className="text-gray-300 mb-4">
                            {t?.pleaseConfigureSession || 'Please configure your session details first'}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 mb-6 max-w-md mx-auto">
                        <h4 className="text-white font-semibold mb-3">{t?.checklist || 'Configuration Checklist'}:</h4>
                        <div className="space-y-2 text-left">
                            <div className="flex items-center">
                                <span className={`mr-2 ${currentSessionSelection ? '✅' : '❌'}`}>
                                    {currentSessionSelection ? '✅' : '❌'}
                                </span>
                                <span className={currentSessionSelection ? 'text-green-400' : 'text-gray-400'}>
                                    {t?.selectVrExperience || 'Select VR Experience'}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${bookingType ? '✅' : '❌'}`}>
                                    {bookingType ? '✅' : '❌'}
                                </span>
                                <span className={bookingType ? 'text-green-400' : 'text-gray-400'}>
                                    {t?.chooseBookingType || 'Choose Booking Type'}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${playerCount > 0 ? '✅' : '❌'}`}>
                                    {playerCount > 0 ? '✅' : '❌'}
                                </span>
                                <span className={playerCount > 0 ? 'text-green-400' : 'text-gray-400'}>
                                    {t?.setPlayerCount || 'Set Player Count'}
                                </span>
                            </div>
                            {bookingType === 'session' && (
                                <div className="flex items-center">
                                    <span className={`mr-2 ${sessionCount > 0 ? '✅' : '❌'}`}>
                                        {sessionCount > 0 ? '✅' : '❌'}
                                    </span>
                                    <span className={sessionCount > 0 ? 'text-green-400' : 'text-gray-400'}>
                                        {t?.selectSessionCount || 'Select Session Count'}
                                    </span>
                                </div>
                            )}
                            {bookingType === 'hourly' && (
                                <div className="flex items-center">
                                    <span className={`mr-2 ${durationHours > 0 ? '✅' : '❌'}`}>
                                        {durationHours > 0 ? '✅' : '❌'}
                                    </span>
                                    <span className={durationHours > 0 ? 'text-green-400' : 'text-gray-400'}>
                                        {t?.setDuration || 'Set Duration'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setMode(MODE.SESSION_SELECTION)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                    >
                        {t?.backToConfiguration || 'Back to Configuration'}
                    </button>
                </div>
            );
        }

        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setMode(MODE.SESSION_SELECTION)}
                        className="text-purple-400 hover:text-purple-300"
                    >
                        {t?.backToSessions || '← Back to Sessions'}
                    </button>
                    <h2 className="text-2xl font-bold text-white">
                        {getTranslatedExperienceName(currentSessionSelection?.name)}
                    </h2>
                </div>



            {/* Time Pass Summary */}
            {bookingType === 'pass' && currentSessionSelection?.pass_type && (
                <div className="mb-6 p-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-lg">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {currentSessionSelection.name}
                        </h3>
                        <div className="text-3xl font-bold text-green-400 mb-3">
                            ${currentSessionSelection.price}
                        </div>
                        <div className="text-gray-300 mb-4">
                            {currentSessionSelection.duration_minutes / 60} {currentSessionSelection.duration_minutes === 60 ? (t?.hour || 'hour') : (t?.hours || 'hours')} {t?.unlimitedAccess || 'unlimited access'}
                        </div>
                        <div className="bg-green-900/30 rounded-lg p-4">
                            <p className="text-green-400 font-semibold mb-2">
                                ✨ {t?.whatsIncluded || "What's Included"}:
                            </p>
                            <ul className="text-green-300 text-sm space-y-1">
                                <li>• {t?.allVrExperiences || 'All VR experiences'}</li>
                                <li>• {t?.unlimitedSessions || 'Unlimited sessions'}</li>
                                <li>• {t?.flexibleScheduling || 'Flexible scheduling'}</li>
                                <li>• {t?.noAdditionalFees || 'No additional fees'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <BookingCalendar
                selectedSession={currentSessionSelection}
                onTimeSlotSelect={handleTimeSlotSelect}
                bookingType={bookingType}
                allowMultipleSlots={
                    currentSessionSelection?.pass_type ||
                    (currentSessionSelection && sessionCount * currentSessionSelection.duration_minutes > 60)
                }
                maxSlots={
                    currentSessionSelection?.pass_type
                        ? (currentSessionSelection.duration_hours || Math.ceil((currentSessionSelection.duration_minutes || 60) / 60))
                        : Math.ceil((sessionCount * (currentSessionSelection?.duration_minutes || 60)) / 60)
                }
                sessionCount={sessionCount}
            />

            {/* Debug info for development */}
            {process.env.NODE_ENV === 'development' && currentSessionSelection && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg text-sm text-gray-300">
                    <h4 className="font-bold text-white mb-2">Debug Info:</h4>
                    <p>Session: {currentSessionSelection.name}</p>
                    <p>Duration per session: {currentSessionSelection.duration_minutes} minutes</p>
                    <p>Session count: {sessionCount}</p>
                    <p>Total duration: {sessionCount * (currentSessionSelection.duration_minutes || 0)} minutes</p>
                    <p>Is pass: {currentSessionSelection.pass_type ? 'Yes' : 'No'}</p>
                    <p>Allow multiple slots: {(currentSessionSelection?.pass_type || (currentSessionSelection && sessionCount * currentSessionSelection.duration_minutes > 60)) ? 'Yes' : 'No'}</p>
                    <p>Max slots: {currentSessionSelection?.pass_type ? (currentSessionSelection.duration_hours || Math.ceil((currentSessionSelection.duration_minutes || 60) / 60)) : Math.ceil((sessionCount * (currentSessionSelection?.duration_minutes || 60)) / 60)}</p>
                </div>
            )}





            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white text-sm">
                    <h4 className="font-bold mb-2">Debug Info:</h4>
                    <p>Booking Type: {bookingType}</p>
                    <p>Allow Multiple Slots: {bookingType === 'hourly' ? 'Yes' : 'No'}</p>
                    <p>Selected Time Slot: {selectedTimeSlot ? JSON.stringify(selectedTimeSlot, null, 2) : 'None'}</p>
                </div>
            )}

            {/* Selected Time Slots Display and Continue Button */}
            {selectedTimeSlot && (
                <div className="mt-6 pb-8 text-center">
                    {/* Show selected time slots */}
                    <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                        <h4 className="text-white font-semibold mb-2">
                            {selectedTimeSlot.timeSlots ? (t?.selectedTimeSlots || 'Selected Time Slots') : (t?.selectedTimeSlot || 'Selected Time Slot')}:
                        </h4>
                        {selectedTimeSlot.timeSlots ? (
                            <div>
                                <div className="flex flex-wrap gap-2 justify-center mb-2">
                                    {selectedTimeSlot.timeSlots.map((slot, index) => (
                                        <span key={index} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                                            {slot.displayTime}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-300 text-sm">
                                    {t?.totalDuration || 'Total Duration'}: {selectedTimeSlot.duration} {t?.hours || 'hour(s)'}
                                </p>
                            </div>
                        ) : (
                            <div className="text-purple-300 font-medium">
                                {selectedTimeSlot.timeSlot?.displayTime}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            // Show user type selection modal/overlay
                            setShowUserTypeModal(true);
                        }}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-bold"
                    >
                        {t?.continueToBooking || 'Continue to Booking'} - ${calculatePrice(currentSessionSelection, sessionCount, playerCount, bookingType, durationHours)}
                    </button>
                </div>
            )}
            </div>
        );
    };

    const renderUserTypeSelection = () => (
        <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">{t?.bookingConfiguration || 'Booking Configuration'}</h1>
            <p className="text-lg mb-8">{currentSessionSelection?.pass_type ? (t?.completeYourBooking || 'Complete your booking') : (t?.customizeVrExperience || 'Customize your VR experience')}</p>

            {/* Time Pass Summary */}
            {currentSessionSelection?.pass_type && (
                <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {currentSessionSelection.name}
                        </h3>
                        <div className="text-3xl font-bold text-green-400 mb-3">
                            ${currentSessionSelection.price}
                        </div>
                        <div className="text-gray-300 mb-4">
                            {currentSessionSelection.duration_minutes / 60} {currentSessionSelection.duration_minutes === 60 ? (t?.hour || 'hour') : (t?.hours || 'hours')} {t?.unlimitedAccess || 'unlimited access'}
                        </div>
                        <div className="bg-green-900/30 rounded-lg p-3">
                            <p className="text-green-400 text-sm font-semibold">
                                ✨ {t?.whatsIncluded || "What's Included"}:
                            </p>
                            <ul className="text-green-300 text-sm space-y-1">
                                <li>• {t?.allVrExperiences || 'All VR experiences'}</li>
                                <li>• {t?.unlimitedSessions || 'Unlimited sessions'}</li>
                                <li>• {t?.flexibleScheduling || 'Flexible scheduling'}</li>
                                <li>• {t?.noAdditionalFees || 'No additional fees'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Session and Player Count Controls - Only for regular sessions, not time passes */}
            {!currentSessionSelection?.pass_type && (
                <div className="bg-blackish border border-gray-700 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold mb-4 text-white">{t?.sessionDetails || 'Session Details'}</h3>

                {/* Session Count */}
                {currentSessionSelection?.name !== 'Photo Booth' && (
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
                                1 {t?.session || 'session'} - ${getBasePrice(currentSessionSelection, 1, bookingType, durationHours)} {t?.perPerson || 'per person'}
                            </button>
                            <button
                                onClick={() => setSessionCount(2)}
                                className={`px-6 py-3 rounded-lg transition-all ${
                                    sessionCount === 2
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                2 {t?.sessions || 'sessions'} - ${getBasePrice(currentSessionSelection, 2, bookingType, durationHours)} {t?.perPerson || 'per person'}
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
                                max={currentSessionSelection?.max_players || 10}
                                value={playerCount}
                                onChange={(e) => setPlayerCount(Math.min(currentSessionSelection?.max_players || 10, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="bg-gray-800 text-white text-center w-20 py-3 rounded-lg text-lg font-bold"
                            />
                            <div className="text-gray-400 text-sm mt-1">
                                {t?.maxPlayers || 'Max'} {currentSessionSelection?.max_players}
                            </div>
                        </div>
                        <button
                            onClick={() => setPlayerCount(Math.min(currentSessionSelection?.max_players || 10, playerCount + 1))}
                            className="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-600 disabled:opacity-50"
                            disabled={playerCount >= (currentSessionSelection?.max_players || 10)}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Price Display with Discounts */}
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                    {(() => {
                        const basePrice = getBasePrice(currentSessionSelection, sessionCount, bookingType, durationHours);
                        const totalPrice = calculatePrice(currentSessionSelection, sessionCount, playerCount, bookingType, durationHours);
                        const discount = getDiscountInfo(playerCount);
                        const subtotal = basePrice * playerCount;
                        const discountAmount = subtotal - totalPrice;

                        return (
                            <div>
                                <div className="mb-3">
                                    <p className="text-gray-300 text-sm">
                                        {t?.pricePerPerson || 'Price per person'}: ${basePrice.toFixed(2)}
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        {playerCount} {playerCount === 1 ? (t?.person || 'person') : (t?.people || 'people')} × ${basePrice.toFixed(2)} = ${subtotal.toFixed(2)}
                                    </p>
                                </div>

                                {discount && (
                                    <div className="mb-3 p-2 bg-green-900/30 rounded-lg border border-green-500/30">
                                        <p className="text-green-400 font-semibold text-sm">
                                            🎉 {discount.name}: {discount.discount}% {t?.off || 'OFF'}
                                        </p>
                                        <p className="text-green-300 text-sm">
                                            {t?.youSave || 'You save'}: ${discountAmount.toFixed(2)}
                                        </p>
                                    </div>
                                )}

                                <div className="border-t border-gray-600 pt-3">
                                    <p className="text-white text-xl font-bold">
                                        {t?.total || 'Total'}: ${(totalPrice || 0).toFixed(2)}
                                    </p>
                                    {bookingType === 'hourly' && (
                                        <p className="text-gray-400 text-sm mt-1">
                                            {t?.for || 'for'} {durationHours} {durationHours === 1 ? (t?.hour || 'hour') : (t?.hours || 'hours')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
            )}

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
                onClick={() => {
                    setMode(MODE.CALENDAR);
                    // Scroll to top to show calendar
                    setTimeout(() => {
                        const modalContainer = document.getElementById('booking-modal-container');
                        if (modalContainer) {
                            modalContainer.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }, 100);
                }}
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
                        <span className="font-semibold text-white">{getTranslatedExperienceName(currentSessionSelection?.name)}</span>
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
                        // Use dynamic pricing from database
                        const basePrice = getBasePrice(currentSessionSelection, sessionCount, bookingType, durationHours);

                        const subtotal = basePrice * playerCount;
                        const discountInfo = getDiscountInfo(playerCount);
                        const finalPrice = Number(calculatePrice(currentSessionSelection, sessionCount, playerCount, bookingType, durationHours)) || 0;

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
                        <span className="text-green-400 font-bold">${calculatePrice(currentSessionSelection, sessionCount, playerCount, bookingType, durationHours)}</span>
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
                        <span className="text-green-400 font-bold">${calculatePrice(currentSessionSelection, sessionCount, playerCount, bookingType, durationHours)}</span>
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
        <div className="w-full max-w-none mx-auto p-2 sm:p-4 pb-8 overflow-x-hidden">
            {/* Step Indicator - Always visible except on success */}
            {mode !== MODE.SUCCESS && <StepIndicator />}

            {/* Step Title - Always visible */}
            <div className="mb-4 text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    {mode === MODE.SESSION_SELECTION && (t?.selectVrExperience || 'Select VR Experience')}
                    {mode === MODE.CONFIGURE_SESSION && (t?.configureSession || 'Configure Session')}
                    {mode === MODE.CALENDAR && (t?.selectDateTime || 'Select Date & Time')}
                    {mode === MODE.USER_TYPE && (t?.bookingConfiguration || 'Booking Configuration')}
                    {mode === MODE.GUEST_DETAILS && (t?.guestDetails || 'Guest Details')}
                    {mode === MODE.CONFIRMATION && (t?.confirmation || 'Confirmation')}
                    {mode === MODE.PAYMENT_METHOD && (t?.payment || 'Payment')}
                </h2>
            </div>

            {mode === MODE.SESSION_SELECTION && renderSessionSelection()}
            {mode === MODE.CONFIGURE_SESSION && renderConfigureSession()}
            {mode === MODE.CALENDAR && renderCalendar()}
            {mode === MODE.GUEST_DETAILS && renderGuestDetails()}
            {mode === MODE.CONFIRMATION && renderConfirmation()}
            {mode === MODE.SUCCESS && renderSuccess()}

            {/* User Type Selection Modal */}
            {showUserTypeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">
                            {t?.chooseBookingType || 'Choose Booking Type'}
                        </h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleUserTypeSelect('registered')}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                            >
                                <div className="text-lg font-semibold">🔐 {t?.registeredUser || 'Registered User'}</div>
                                <div className="text-sm text-blue-200">{t?.fasterCheckout || 'Faster checkout with saved details'}</div>
                            </button>
                            <button
                                onClick={() => handleUserTypeSelect('guest')}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200"
                            >
                                <div className="text-lg font-semibold">👤 {t?.guestBooking || 'Guest Booking'}</div>
                                <div className="text-sm text-green-200">{t?.noAccountRequired || 'No account required'}</div>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowUserTypeModal(false)}
                            className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
                        >
                            {t?.cancel || 'Cancel'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedBookingForm;
