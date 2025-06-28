'use client'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// Helper to format Date object to YYYY-MM-DDTHH:MM in LOCAL time (suitable for datetime-local input)
const formatLocalDateTimeInput = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

import Form from '../common/Form';
import FieldContainer from '../common/FieldContainer';
import Input from '../common/Input';
import Select from '../common/Select';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import { formatDateTime } from '@/utils/formateDateTime';
import CheckoutForm from './CheckoutForm';
import { useDispatch, useSelector } from 'react-redux';
import { closeBookModal } from '@/Store/ReduxSlice/bookModalSlice';
import toast from 'react-hot-toast';
import { fetchUserData } from '@/Store/Actions/userActions';

const MODE = {
    BOOKING: "BOOKING",
    DETAIL: "DETAIL",
    CHECKOUT: "CHECKOUT",
    SUCCESS: "SUCCESS",
}

const BookingForm = ({ prefill = null, onClose }) => {
    // Prefill-aware initial state
    const [formData, setFormData] = useState({
        machine_type: "",
        start_time: "",
        end_time: "",
        price: ""
    });
    const [mode, setMode] = useState(MODE.BOOKING);
    const [sessions, setSessions] = useState([]); // fetched or dummy
    const [prefillDuration, setPrefillDuration] = useState(null);
    const [selectedSession, setSelectedSession] = useState({})
    // const [bookings,setBookings] = useState([])
    const [selectedSessionId, setSelectedSessionId] = useState(""); // Track selected session ID
    const { bookings } = useSelector((state) => state.userData)
    const dispatch = useDispatch()
    const handleFetchSession = async () => {
        if(prefill){
            // Skip fetching when using prefill – we'll create a dummy session
            return;
        }
        try {
            const { data } = await axios.get(`${API_URL}/user/get-sessions`, getAuthHeaders());
            setSessions(data?.sessions);
        } catch (error) {
            console.log(error);
        }
    };



    useEffect(() => {
        if(prefill){
            // Build dummy session based on prefill data
            const baseDuration = 30; // minutes per single session
            const sessionsCount = prefill.sessionsCount || 1;
            const duration_minutes = baseDuration * sessionsCount;

            const dummySession = {
                session_id: -1,
                name: prefill.machine_type || 'Custom Booking',
                duration_minutes,
                price: prefill.price,
            };
            setSessions([dummySession]);
            setSelectedSessionId(-1);
            setPrefillDuration(duration_minutes);
            setFormData(prev => ({
                ...prev,
                machine_type: dummySession.name,
                price: dummySession.price,
            }));
        }
        handleFetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "machine_type") {
            setSelectedSessionId(value);
            const selectedSession = sessions.find(session => session.session_id === parseInt(value));
            if (selectedSession) {
                setFormData(prev => ({
                    ...prev,
                    machine_type: selectedSession.name,
                    price: selectedSession.price
                }));
            }
        } else if (name === "start_time") {
            let selectedSession = sessions.find(session => session.session_id === parseInt(selectedSessionId));
        if(!selectedSession && prefillDuration){
            selectedSession = { duration_minutes: prefillDuration };
        }
            if (selectedSession) {
                const startTime = new Date(value);
                const now = new Date();

                // Prevent past time selection
                if (startTime < now) {
                    alert("Start time cannot be in the past.");
                    return;
                }

                // Calculate end time correctly
                const endTime = new Date(startTime.getTime() + selectedSession.duration_minutes * 60000);
                const formattedEndTime = formatLocalDateTimeInput(endTime);

                setFormData(prev => ({
                    ...prev,
                    start_time: value,
                    end_time: formattedEndTime
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
console.log(bookings)
    const handleSubmit = async (e) => {
        e.preventDefault();
    
          // Find the selected session
    const selectedSessions = sessions.find(session => session.session_id === parseInt(selectedSessionId));

    if (selectedSessions) {
        // Check if the user has already booked this session with a pending or started status
        const existingBooking = bookings.find(booking => 
            booking.session_id === selectedSessions.session_id && 
            (booking.session_status === 'pending' || booking.session_status === 'started')
        );

        if (existingBooking) {
            toast.error("You have already booked or are currently playing this session.");
            return; // Stop further execution
        }else{

                const bookingData = {
                    session_id: selectedSessions.session_id,
                    machine_type: selectedSessions.name,
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                    price: formData.price,
                    payment_status: "paid"
                };
                setSelectedSession(bookingData)
                setMode('DETAIL')
            }
    
        }
    };
    const sessionOptions = sessions.map(session => ({
        value: session.session_id, // Use session_id as the value
        label: `${session.name}` // Add session_id to the label for clarity
    }));

    // confirm payent
    const handlePayment = async() => {
        try {
                // Try to book the session
                const response = await axios.post(`${API_URL}/user/book-session`, selectedSession, getAuthHeaders());
                console.log("Booking Response:", response);
    
                if (response.status === 201) {
                    toast?.success('Successfully Booked Session')
                    dispatch(fetchUserData())
                }
            } catch (error) {
                console.log(error)
            }
        dispatch(closeBookModal());
    if(onClose) onClose();

    }
    


    return (
        <div className='text-white w-full max-w-[540px]'>
            {mode === "BOOKING" &&
                <>
                    <h1 className='text-[50px] font-bold text-white text-center'>Book Now</h1>
                    <p className='text-lg text-white mt-2 text-center'>Please enter your details</p>
                    <Form onSubmit={handleSubmit} className='mt-[51px] w-full max-w-[540px]'>
                        <FieldContainer label="Machine Type" htmlFor="machine_type">
                            <Select
                                name="machine_type"
                                value={selectedSessionId} // Use selectedSessionId as the value
                                onChange={handleChange}
                                options={[{ value: '', label: 'Select a session' }, ...sessionOptions]}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="Start Time" htmlFor="start_time">
                            <Input
                                type="datetime-local"
                                placeholder="Start Time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </FieldContainer>
                        <FieldContainer label="End Time" htmlFor="end_time">
                            <Input
                                type="datetime-local"
                                placeholder="End Time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </FieldContainer>
                        <FieldContainer label="Price" htmlFor="price">
                            <Input
                                type="text"
                                placeholder="Price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </FieldContainer>

                        <button
                            className="bg-white text-black w-full p-[14px] text-lg rounded-md font-semibold"
                            type='submit'
                        >
                            Book Now
                        </button>
                    </Form>
                </>}
            {mode === 'DETAIL' &&
                <div>
                    <h1 className='text-[50px] font-bold text-white text-center'>Book Now</h1>
                    {selectedSession &&


                        <div className="text-white">

                            <p className="flex justify-between items-center border-b border-gray-600 py-2">
                                <strong>Machine Type:</strong> {selectedSession.machine_type}
                            </p>
                            <p className="flex justify-between items-center border-b border-gray-600 py-2">
                                <strong>Start Time:</strong> {formatDateTime(selectedSession?.start_time)}
                            </p>
                            <p className="flex justify-between items-center border-b border-gray-600 py-2">
                                <strong>End Time:</strong> {formatDateTime(selectedSession?.end_time)}
                            </p>
                            <p className="flex justify-between items-center border-b border-gray-600 py-2">
                                <strong>Payment Status:</strong> {selectedSession.payment_status}
                            </p>

                            <button onClick={() => setMode('BOOKING')} className='bg-[#5b2493] py-2 px-4 rounded-lg text-white mt-4'>Edit Details</button>
                        </div>
                    }
                    <button
                        onClick={() => setMode('CHECKOUT')}
                        className="bg-white text-black w-full mt-4 p-[14px] text-lg rounded-md font-semibold"
                    >
                        Checkout
                    </button>
                </div>
            }
            {mode === 'CHECKOUT' &&
                <CheckoutForm bookingSummary={selectedSession} setMode={setMode} onCheckout={handlePayment} handleRedeem={handlePayment} />
            }
        </div>
    );
};

BookingForm.propTypes = {
    prefill: PropTypes.object,
    onClose: PropTypes.func,
};

export default BookingForm;