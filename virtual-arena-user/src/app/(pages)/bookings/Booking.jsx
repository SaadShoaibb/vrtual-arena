'use client';
import AuthModel from '@/app/components/AuthModal';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';
import { submitReview } from '@/Store/ReduxSlice/reviewSlice';
import { useDispatch, useSelector } from 'react-redux';

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedBookingForFeedback, setSelectedBookingForFeedback] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const {userData} = useSelector((state)=>state.userData)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    console.log(userData)
    const searchParams = useSearchParams();
    const dispatch = useDispatch()
    // Fetch bookings from the backend
    const fetchBookings = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/get-bookings`, getAuthHeaders());
            setBookings(response.data.bookings); // Assuming the response data is an array of bookings
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to fetch bookings.');
        }
    };

    // Handle cancel booking
    const handleCancelBooking = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    // Confirm cancel booking
    const confirmCancelBooking = async () => {
        try {
            const response = await axios.put(
                `${API_URL}/user/cancel-booking/${selectedBooking.booking_id}`,
                {},
                getAuthHeaders()
            );
            if (response.status === 200) {
                toast.success('Booking canceled successfully.');
                fetchBookings(); // Refresh the bookings list
            } else {
                toast.error('Failed to cancel booking.');
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
            toast.error('Failed to cancel booking.');
        }
        setIsModalOpen(false);
    };

    // Handle row click to open sidebar
    const handleRowClick = (booking) => {
        setSelectedBooking(booking);
        setIsSidebarOpen(true);
        router.push(`/bookings?booking_id=${booking.booking_id}`); // Update URL query
    };

    // Close sidebar and clear query
    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedBooking(null);
        router.push('/bookings'); // Clear URL query
    };

    // Download booking receipt as PDF
    const downloadReceipt = async () => {
        if (!selectedBooking) return;

        const html2pdf = (await import('html2pdf.js')).default;

        // Derive values with graceful fallbacks
        const price =
            selectedBooking.price ??
            selectedBooking.total_price ??
            selectedBooking.final_price ??
            selectedBooking.amount ??
            'N/A';

        const sessions =
            selectedBooking.sessions ??
            selectedBooking.sessions_count ??
            selectedBooking.session_count ??
            selectedBooking.session_qty ??
            'N/A';

        const passType =
            selectedBooking.pass_type ??
            selectedBooking.pass ??
            selectedBooking.passType ??
            'N/A';

        const members =
            selectedBooking.members ??
            selectedBooking.people_count ??
            selectedBooking.member_count ??
            selectedBooking.participants ??
            'N/A';

        const receiptTemplate = document.createElement('div');
        receiptTemplate.innerHTML = `
            <div class="p-6 bg-white text-black">
                <img src='/assets/logo.png' class="w-[179px] md:w-[199px] mb-10" />
                <h1 class="text-2xl font-bold mb-4">Booking Receipt</h1>
                <p><strong>Booking ID:</strong> ${selectedBooking.booking_id}</p>
                <p><strong>User Name:</strong> ${selectedBooking.user_name}</p>
                <p><strong>Session Name:</strong> ${selectedBooking.session_name}</p>
                <p><strong>Machine Type:</strong> ${selectedBooking.machine_type}</p>
                <p><strong>Start Time:</strong> ${new Date(selectedBooking.start_time).toLocaleString()}</p>
                <p><strong>End Time:</strong> ${new Date(selectedBooking.end_time).toLocaleString()}</p>
                <p><strong>Members:</strong> ${members}</p>
                <p><strong>Sessions:</strong> ${sessions}</p>
                <p><strong>Pass Type:</strong> ${passType}</p>
                <p><strong>Total Price:</strong> $${price}</p>
                <p><strong>Payment Status:</strong> ${selectedBooking.payment_status}</p>
            </div>`;

        await html2pdf().from(receiptTemplate).save(`booking-receipt-${selectedBooking.booking_id}.pdf`);
    };

    // Check URL query on component mount
    useEffect(() => {
        const bookingId = searchParams.get('booking_id');
        if (bookingId) {
            const booking = bookings.find((b) => b.booking_id === parseInt(bookingId));
            if (booking) {
                setSelectedBooking(booking);
                setIsSidebarOpen(true);
            }
        }
    }, [bookings, searchParams]);

    useEffect(() => {
        fetchBookings();
    }, []);

    // Table columns
    const columns = [
        { header: 'Booking ID', accessor: 'booking_id' },
        { header: 'Session Name', accessor: 'session_name' },
        { header: 'Machine Type', accessor: 'machine_type' },
        { header: 'Start Time', accessor: 'start_time' },
        { header: 'End Time', accessor: 'end_time' },
        { header: 'Payment Status', accessor: 'payment_status' },
        { header: 'Sesion Status', accessor: 'session_status' },
        { header: 'User Name', accessor: 'user_name' },
        { header: 'Actions', accessor: 'actions' },
    ];

    const data = bookings?.map((booking) => ({
        booking_id: booking.booking_id,
        session_name: booking.session_name,
        machine_type: booking.machine_type,
        start_time: new Date(booking.start_time).toLocaleString(),
        end_time: new Date(booking.end_time).toLocaleString(),
        payment_status: booking.payment_status,
        session_status: booking.session_status,
        user_name: booking.user_name,
        actions: booking.session_status === 'completed' ? (
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Stop event propagation
                    openFeedbackModal(booking); // Open feedback modal
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Leave Feedback
            </button>
        ) : (
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Stop event propagation
                    handleCancelBooking(booking);
                }}
                className="text-red-600 hover:text-red-800"
            >
                Cancel
            </button>
        ),
    }));


    // Open feedback modal
    const openFeedbackModal = (booking) => {
        setSelectedBookingForFeedback(booking);
        setIsFeedbackModalOpen(true);
    };

    // Close feedback modal
    const closeFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
        setRating(0);
        setComment('');
    };

    // Handle feedback submission
    const handleSubmitFeedback = () => {
        if (!selectedBookingForFeedback || rating === 0) {
            toast.error('Please provide a rating.');
            return;
        }
    
        dispatch(
            submitReview({
                user_id: userData.user_id, // Assuming userData is available from Redux
                entity_type: 'VR_SESSION', // Set entity_type to BOOKINGS
                entity_id: selectedBookingForFeedback.booking_id, // Use booking_id as entity_id
                rating,
                comment,
            })
        ).then(() => {
            toast.success('Feedback submitted successfully!');
            closeFeedbackModal();
        }).catch(() => {
            toast.error('Failed to submit feedback.');
        });
    };
    return (
        <div className="p-6 bg-blackish text-white">
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-900">
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-nowrap text-left text-xs font-semibold text-white uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gray-50 hover:text-black cursor-pointer"
                                onClick={() => handleRowClick(bookings[rowIndex])} // Open sidebar on row click
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-6 text-nowrap py-4 border-b border-gray-200 text-sm"
                                    >
                                        {row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed h-screen flex justify-center w-screen items-center z-50 top-0 left-0">
                    <div className="absolute inset-0 z-0 bg-black bg-opacity-50"></div>
                    <div className="flex flex-col items-center md:mx-10 pt-16 pb-12 px-2 md:px-6 max-h-[90vh] overflow-auto w-full max-w-[700px] rounded-2xl bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] relative">
                        <div className="p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Confirm Cancel Booking</h2>
                            <p className="mb-6">
                                Are you sure you want to cancel booking ID{' '}
                                <strong>{selectedBooking?.booking_id}</strong>?
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm text-white hover:bg-gray-100 rounded-lg"
                                >
                                    No, Keep It
                                </button>
                                <button
                                    onClick={confirmCancelBooking}
                                    className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar for Booking Details */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-grad shadow-lg z-50"
                    >
                        <div className="p-6">
                            <button
                                onClick={closeSidebar}
                                className="text-white mb-6"
                            >
                                &times; Close
                            </button>
                            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                            {selectedBooking && (
                                <div>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Booking ID:</strong> {selectedBooking.booking_id}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Session Name:</strong> {selectedBooking.session_name}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Machine Type:</strong> {selectedBooking.machine_type}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Start Time:</strong> {new Date(selectedBooking.start_time).toLocaleString()}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>End Time:</strong> {new Date(selectedBooking.end_time).toLocaleString()}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Members:</strong> {selectedBooking.members ?? selectedBooking.people_count ?? selectedBooking.member_count ?? 'N/A'}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Total Price:</strong> {selectedBooking.price ? `$${selectedBooking.price}` : selectedBooking.total_price ? `$${selectedBooking.total_price}` : selectedBooking.final_price ? `$${selectedBooking.final_price}` : 'N/A'}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Payment Status:</strong> {selectedBooking.payment_status}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>User Name:</strong> {selectedBooking.user_name}</p>
                                    <button onClick={downloadReceipt} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Download Receipt
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {isFeedbackModalOpen && (
                <AuthModel onClose={closeFeedbackModal}>
                    <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Rating:</label>
                        <div className="flex">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={`cursor-pointer text-2xl ${index < rating ? 'text-yellow-500' : 'text-gray-500'
                                        }`}
                                    onClick={() => setRating(index + 1)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Comment:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-black"
                            rows="3"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={closeFeedbackModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitFeedback}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </AuthModel>
            )}
        </div>
    );
};

export default Booking;