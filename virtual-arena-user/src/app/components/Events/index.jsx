'use client'
import React, { useEffect, useState } from 'react'
import { IoLocationOutline } from 'react-icons/io5'
import { IoMdTime } from "react-icons/io";
import BookNowButton from '../common/BookNowButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournaments } from '@/Store/ReduxSlice/tournamentSlice';
import TournamentBookingForm from './TournamentBookingForm';
import AuthModel from '../AuthModal';
import PaymentOptionsModal from '../PaymentOptionsModal';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import toast from 'react-hot-toast';
import PaymentModal from '../PaymentForm';
import { useRouter } from 'next/navigation';
import { fetchUserData } from '@/Store/Actions/userActions';
import { translations } from '@/app/translations';
import { addToCart, fetchCart } from '@/Store/ReduxSlice/addToCartSlice';

const Calender = ({ locale = 'en' }) => {
    const t = translations[locale] || translations.en;
    const [tournament, setTournament] = useState({})
    const [tournamentModel, setTournamentModel] = useState(false)
    const [paymentModel, setPaymentModel] = useState(false)
    const [selectedTournament, setSelectedTournament] = useState(null)
    const [showPaymentOptions, setShowPaymentOptions] = useState(false)
    const { userData, registrations, isAuthenticated } = useSelector((state) => state.userData)
    const [option, setOption] = useState('card')
    const dispatch = useDispatch();
    const router = useRouter()
    const { tournaments, status, error } = useSelector((state) => state.tournaments);
    const [code, setCode] = useState("");

    const handleInputChange = (e) => {
        setCode(e.target.value);
    };

    useEffect(() => {
        dispatch(fetchTournaments());
    }, [dispatch]);

    const handleOption = (option) => {
        setOption(option)
    }

    // Removed duplicate state variables - using the ones defined above

    const handleSelectTournament = (tournament) => {
        console.log('Buy Tickets clicked for tournament:', tournament);
        console.log('Is authenticated:', isAuthenticated);

        // Check if already registered (only for authenticated users)
        if (isAuthenticated && registrations?.includes(tournament?.tournament_id)) {
            toast.error("You have already registered for this tournament")
            return;
        }

        // Show payment options modal (supports both guest and user registration)
        console.log('Setting selected tournament and showing payment options');
        setSelectedTournament(tournament);
        setShowPaymentOptions(true);
    };
    
    // Removed old payment logic - now handled by PaymentOptionsModal
    
    // Removed unused payment choice handler - now handled by PaymentOptionsModal

    const handleCloseTournamentModel = () => {
        setTournamentModel(false)
    }

    const handleSubmit = async (formData) => {
        console.log("form submitted", formData)
        setSelectedTournament(formData.tournament);
        setTournamentModel(false);
        setPaymentModel(true);
    }

    const handlePaymentSuccess = async () => {
        try {
            const payload = {
                tournament_id: selectedTournament?.tournament_id,
                user_id: userData?.user_id
            };
            const response = await axios.post(`${API_URL}/user/register-for-tournament/`, payload, getAuthHeaders());
            console.log(response);
            toast.success("Registration successful!");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Registration failed");
        } finally {
            setPaymentModel(false);
        }
    }

    const handleRedeem = async () => {
        try {
            const payload = {
                tournament_id: selectedTournament?.tournament_id,
                user_id: userData?.user_id
            };
            const response2 = await axios.post(`${API_URL}/user/register-for-tournament/`, payload, getAuthHeaders());
            console.log(response2);
            dispatch(fetchUserData())
            setPaymentModel(false)
            toast.success("Registration successful!");
        } catch (err) {
            console.log(err)
            alert(err.response?.data?.message || 'Failed to redeem gift card.');
        }
    };

    return (
        <>
            <div className='w-full bg-blackish h-[101px] overflow-hidden'></div>
            <div id='events' className='w-full h-full bg-blackish'>
                <div className='w-full mx-auto max-w-[1600px] border-y pt-[100px] pb-[51px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-4'>
                        <div>
                            <h1 className='text-gradiant text-[26px] font-semibold text-wrap-balance'>{t.calendar}</h1>
                            <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none text-wrap-balance'>{t.ourEvents}</h1>
                        </div>
                        <div>
                            <p className='text-xl text-white font-light text-wrap-balance'>
                                {t.eventsDescription}
                            </p>
                            <BookNowButton margin='mt-[36px]' locale={locale} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full h-full bg-blackish'>
                <div className='w-full mx-auto max-w-[1600px] flex-col flex px-4 md:px-6 lg:px-10 xl:px-16 2xl:px-20'>
                    {tournaments?.length > 0 ? tournaments?.map((e, i) => {
                        const startDate = new Date(e.start_date);
                        const endDate = new Date(e.end_date);
                        const day = startDate.getDate();
                        const monthFull = startDate.toLocaleString('default', { month: 'long' });
                        const month = monthFull.substring(0, 3); // Get first 3 letters of month
                        const year = startDate.getFullYear();
                        const startTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                        const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                        const time = `${startTime} – ${endTime}`;

                        return (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border-b gap-6 md:gap-8 lg:gap-6 xl:gap-8 py-[35px]' key={i}>
                                {/* Date Section */}
                                <div className='flex items-center gap-3 col-span-1 md:col-span-2 lg:col-span-1 justify-center md:justify-start mb-6 md:mb-0 lg:pr-4'>
                                    <h1 className='text-[50px] sm:text-[60px] md:text-[70px] lg:text-[80px] text-white font-bold leading-none flex-shrink-0'>{day}</h1>
                                    <div className='flex flex-col min-w-0'>
                                        <h1 className='text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] text-white leading-tight whitespace-nowrap'>{month},</h1>
                                        <h1 className='text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] text-white leading-tight'>{year}</h1>
                                    </div>
                                </div>

                                {/* Event Details Section */}
                                <div className='col-span-1 md:col-span-2 lg:col-span-3 flex flex-col text-white justify-center space-y-3 min-w-0 lg:pl-4 xl:pl-6'>
                                    <h1 className='text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] xl:text-[38px] 2xl:text-[42px] font-semibold leading-tight mb-2 capitalize break-words overflow-wrap-anywhere'>{e?.name}</h1>
                                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 items-start sm:items-center'>
                                        <div className='flex items-center gap-2 text-white min-w-0 flex-shrink-0'>
                                            <IoLocationOutline size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
                                            <h1 className='text-sm sm:text-base md:text-lg lg:text-xl leading-tight capitalize break-words overflow-wrap-anywhere'>{e.city}, {e.country}</h1>
                                        </div>
                                        <div className='flex items-center gap-2 text-white min-w-0 flex-shrink-0'>
                                            <IoMdTime size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
                                            <h1 className='text-sm sm:text-base md:text-lg lg:text-xl leading-tight break-words overflow-wrap-anywhere'>{time}</h1>
                                        </div>
                                    </div>
                                </div>

                                {/* Button Section */}
                                <div className='col-span-1 md:col-span-2 lg:col-span-1 flex justify-center lg:justify-end items-center mt-6 lg:mt-0'>
                                    <button
                                        onClick={() => handleSelectTournament(e)}
                                        className='text-sm sm:text-base md:text-lg lg:text-xl font-semibold flex items-center justify-center h-fit w-fit py-3 px-4 sm:px-6 lg:py-4 lg:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] hover:opacity-90 transition-opacity whitespace-nowrap min-w-fit'
                                    >
                                        <span className="hidden sm:inline">Buy Tickets</span>
                                        <span className="sm:hidden">Buy</span>
                                        <img src="/icons/arrow.svg" alt="" className='h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] lg:h-[22px] lg:w-[22px] ml-2 lg:ml-3 rounded-full flex-shrink-0' />
                                    </button>
                                </div>
                            </div>
                        );
                    }) :
                        <span className='text-xl text-white text-center py-4 font-semibold'>No Events are Scheduled</span>
                    }
                </div>

                {paymentModel &&
                    <>
                        <AuthModel onClose={() => setPaymentModel(false)}>
                            <PaymentModal
                                isOpen={paymentModel}
                                onClose={() => setPaymentModel(false)}
                                entity={selectedTournament?.tournament_id}
                                userId={userData?.user_id}
                                amount={selectedTournament?.ticket_price}
                                onSuccess={handlePaymentSuccess}
                                onRedeemSuccess={handleRedeem}
                                type="ticket"
                            />
                        </AuthModel>
                    </>
                }
                
                {false && (
                    <AuthModel onClose={() => setShowPaymentOptions(false)}>
                        <div className="bg-[#1E1E1E] p-6 rounded-lg max-w-md w-full">
                            <h2 className="text-white text-2xl font-bold mb-4">Payment Options</h2>
                            <p className="text-white mb-6">How would you like to pay for this tournament?</p>
                            
                            <div className="flex flex-col gap-4 mb-6">
                                <div 
                                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer ${paymentChoice === 'online' ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]' : 'bg-[#2A2A2A]'}`}
                                    onClick={() => handlePaymentChoiceChange('online')}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 ${paymentChoice === 'online' ? 'border-white bg-white' : 'border-white'} flex items-center justify-center`}>
                                        {paymentChoice === 'online' && <div className="w-3 h-3 rounded-full bg-[#5A79FB]"></div>}
                                    </div>
                                    <span className="text-white font-medium">Pay Online Now (${currentTournament.ticket_price})</span>
                                </div>
                                
                                <div 
                                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer ${paymentChoice === 'at_event' ? 'bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]' : 'bg-[#2A2A2A]'}`}
                                    onClick={() => handlePaymentChoiceChange('at_event')}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 ${paymentChoice === 'at_event' ? 'border-white bg-white' : 'border-white'} flex items-center justify-center`}>
                                        {paymentChoice === 'at_event' && <div className="w-3 h-3 rounded-full bg-[#5A79FB]"></div>}
                                    </div>
                                    <span className="text-white font-medium">Pay at the Event (${currentTournament.ticket_price})</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between">
                                <button 
                                    onClick={() => setShowPaymentOptions(false)}
                                    className="px-6 py-2 bg-[#2A2A2A] text-white rounded-full"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handlePaymentOptionSelect}
                                    className="px-6 py-2 bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] text-white rounded-full"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </AuthModel>
                )}

                {/* Payment Options Modal */}
                {showPaymentOptions && selectedTournament && (
                    <PaymentOptionsModal
                        isOpen={showPaymentOptions}
                        onClose={() => setShowPaymentOptions(false)}
                        tournament={selectedTournament}
                        type="tournament"
                    />
                )}
            </div>
        </>
    )
}

export default Calender
