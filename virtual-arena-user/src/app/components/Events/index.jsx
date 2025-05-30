'use client'
import React, { useEffect, useState } from 'react'
import { IoLocationOutline } from 'react-icons/io5'
import { IoMdTime } from "react-icons/io";
import BookNowButton from '../common/BookNowButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTournaments } from '@/Store/ReduxSlice/tournamentSlice';
import TournamentBookingForm from './TournamentBookingForm';
import AuthModel from '../AuthModal';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import toast from 'react-hot-toast';
import PaymentModal from '../PaymentForm';
import { useRouter } from 'next/navigation';
import { fetchUserData } from '@/Store/Actions/userActions';

const Calender = () => {
    const [tournament, setTournament] = useState({})
    const [tournamentModel, setTournamentModel] = useState(false)
    const [paymentModel, setPaymentModel] = useState(false)
    const [selectedTournament, setSelectedTournament] = useState(null)
    const { userData, registrations } = useSelector((state) => state.userData)
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

    const handleSelectTournament = (tournament) => {
        if (registrations?.includes(tournament?.tournament_id)) {
            toast.error("You have already registered this tournament")
        } else {
            setPaymentModel(true);
            setTournament(tournament);
            setSelectedTournament(tournament)
        }
    };

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
                            <h1 className='text-gradiant text-[26px] font-semibold'>Calender</h1>
                            <h1 className='text-white text-[40px] md:text-[50px] font-bold leading-none'>Our events</h1>
                        </div>
                        <div>
                            <p className='text-xl text-white font-light'>
                                Discover the latest esports tournaments and virtual competitions happening on Virtual Arena. Whether you're a casual gamer or a competitive pro, our events are designed to challenge, entertain, and connect you with the gaming community across the globe.
                            </p>
                            <BookNowButton margin='mt-[36px]' />
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full h-full bg-blackish'>
                <div className='w-full mx-auto max-w-[1600px] flex-col flex px-4 md:px-10 lg:px-16 xl:px-20 2xl:px-6'>
                    {tournaments?.length > 0 ? tournaments?.map((e, i) => {
                        const startDate = new Date(e.start_date);
                        const endDate = new Date(e.end_date);
                        const day = startDate.getDate();
                        const month = startDate.toLocaleString('default', { month: 'long' });
                        const year = startDate.getFullYear();
                        const startTime = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                        const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                        const time = `${startTime} – ${endTime}`;

                        return (
                            <div className='grid grid-cols-5 border-b gap-6 py-[35px]' key={i}>
                                <div className='flex items-center gap-3 col-span-5 xl:col-span-1'>
                                    <h1 className='text-[80px] text-white font-bold leading-none'>{day}</h1>
                                    <h1 className='text-[32px] text-white leading-none'>{month}, <br />{year}</h1>
                                </div>
                                <div className='col-span-5 lg:col-span-3 flex flex-col text-white justify-center'>
                                    <h1 className='text-[40px] xl:text-[50px] font-semibold leading-none mb-2.5 capitalize'>{e?.name}</h1>
                                    <div className='flex flex-col md:flex-row gap-2 md:gap-10 lg:gap-12 xl:gap-20 items-start xl:items-center'>
                                        <div className='flex items-center gap-2 text-white'>
                                            <IoLocationOutline size={26} />
                                            <h1 className='text-xs xl:text-xl leading-none capitalize'>{e.city}, {e.country}</h1>
                                        </div>
                                        <div className='flex items-center gap-2 text-white'>
                                            <IoMdTime size={26} />
                                            <h1 className='text-xs xl:text-xl leading-none'>{time}</h1>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleSelectTournament(e)} className='col-span-5 lg:col-span-2 xl:col-span-1 text-xl font-semibold flex items-center h-fit w-fit justify-self-start lg:justify-self-end my-auto py-2 md:py-4 px-6 md:px-8 text-white rounded-full bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7]'>
                                    Buy Tickets <img src="/icons/arrow.svg" alt="" className='h-[22px] w-[22px] ml-[11px] rounded-full' />
                                </button>
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
            </div>
        </>
    )
}

export default Calender
