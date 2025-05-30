'use client';

import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import AuthModel from '@/app/components/AuthModal';
import { submitReview } from '@/Store/ReduxSlice/reviewSlice';
import { FaStar } from 'react-icons/fa';

const Tournaments = () => {
    const [registrations, setRegistrations] = useState([]);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.userData);

    const fetchRegistrations = async () => {
        try {
            const response = await axios.get(`${API_URL}/user/tournament-registrations`, getAuthHeaders());
            setRegistrations(response.data.registrations);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            toast.error('Failed to fetch registrations.');
        }
    };

    const handleCancelRegistration = (registration) => {
        setSelectedRegistration(registration);
        setIsModalOpen(true);
    };

    const confirmCancelRegistration = async () => {
        try {
            const response = await axios.put(
                `${API_URL}/user/cancel-registration/${selectedRegistration.registration_id}`,
                {},
                getAuthHeaders()
            );
            if (response.status === 200) {
                toast.success('Registration canceled successfully.');
                fetchRegistrations();
            } else {
                toast.error('Failed to cancel registration.');
            }
        } catch (error) {
            console.error('Error canceling registration:', error);
            toast.error('Failed to cancel registration.');
        }
        setIsModalOpen(false);
    };

    const handleRowClick = (registration) => {
        setSelectedRegistration(registration);
        setIsSidebarOpen(true);
        router.push(`/tournaments?tournament_id=${registration.registration_id}`);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedRegistration(null);
        router.push('/tournaments');
    };

    useEffect(() => {
        const registrationId = searchParams.get('tournament_id');
        if (registrationId) {
            const registration = registrations.find((r) => r.registration_id === parseInt(registrationId));
            if (registration) {
                setSelectedRegistration(registration);
                setIsSidebarOpen(true);
            }
        }
    }, [registrations, searchParams]);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const downloadInvoice = async () => {
        const html2pdf = (await import('html2pdf.js')).default;

        const invoiceTemplate = document.createElement('div');
        invoiceTemplate.innerHTML = `
            <div class="p-6 bg-white text-black">
                <img src='/assets/logo.png' class="w-[179px] md:w-[199px] mb-10" />
                <h1 class="text-2xl font-bold mb-4">Tournament Registration Invoice</h1>
                <p><strong>Registration ID:</strong> ${selectedRegistration.registration_id}</p>
                <p><strong>User Name:</strong> ${selectedRegistration.user_name}</p>
                <p><strong>Tournament Name:</strong> ${selectedRegistration.tournament_name}</p>
                <p><strong>Status:</strong> ${selectedRegistration.status}</p>
                <p class="mt-4 text-sm text-gray-500">Thank you for registering!</p>
            </div>
        `;
        document.body.appendChild(invoiceTemplate);

        const options = {
            margin: 10,
            filename: `tournament_invoice_${selectedRegistration.registration_id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        html2pdf().from(invoiceTemplate).set(options).save().then(() => {
            document.body.removeChild(invoiceTemplate);
        });
    };

    const columns = [
        { header: 'Registration ID', accessor: 'registration_id' },
        { header: 'User Name', accessor: 'user_name' },
        { header: 'Tournament Name', accessor: 'tournament_name' },
        { header: 'Status', accessor: 'status' },
        { header: 'Tournament Status', accessor: 'tournament_status' },
        { header: 'Actions', accessor: 'actions' },
    ];

    const data = registrations?.map((registration) => ({
        registration_id: registration.registration_id,
        user_name: registration.user_name,
        tournament_name: registration.tournament_name,
        status: registration.status,
        tournament_status: registration.tournament_status,
        actions: (
            <div className="flex space-x-2">
                {registration.tournament_status === 'completed' ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openReviewModal(registration);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Leave Feedback
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCancelRegistration(registration);
                        }}
                        className="text-red-600 hover:text-red-800"
                    >
                        Cancel
                    </button>
                )}
            </div>
        ),
    }));

    const openReviewModal = (registration) => {
        setSelectedRegistration(registration);
        setIsReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setIsReviewModalOpen(false);
        setRating(0);
        setComment('');
    };

    const handleSubmitReview = () => {
        if (!selectedRegistration || rating === 0) {
            toast.error('Please provide a rating.');
            return;
        }

        dispatch(
            submitReview({
                user_id: userData.user_id,
                entity_type: 'TOURNAMENT',
                entity_id: selectedRegistration.tournament_id,
                rating,
                comment,
            })
        )
            .then(() => {
                toast.success('Review submitted successfully!');
                closeReviewModal();
            })
            .catch(() => {
                toast.error('Failed to submit review.');
            });
    };

    return (
        <div className="p-6 bg-blackish text-white">
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-900">
                            {columns.map((column, index) => (
                                <th key={index} className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
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
                                onClick={() => handleRowClick(registrations[rowIndex])}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 border-b border-gray-200 text-sm">
                                        {row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed h-screen flex justify-center w-screen items-center z-50 top-0 left-0">
                    <div className="absolute inset-0 z-0 bg-black bg-opacity-50"></div>
                    <div className="flex flex-col items-center md:mx-10 pt-16 pb-12 px-2 md:px-6 max-h-[90vh] overflow-auto w-full max-w-[700px] rounded-2xl bg-gradient-to-tr from-[#926BB9] via-[#5A79FB] to-[#2FBCF7] relative">
                        <div className="p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Confirm Cancel Registration</h2>
                            <p className="mb-6">
                                Are you sure you want to cancel registration ID{' '}
                                <strong>{selectedRegistration?.registration_id}</strong>?
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm text-white hover:bg-gray-100 rounded-lg"
                                >
                                    No, Keep It
                                </button>
                                <button
                                    onClick={confirmCancelRegistration}
                                    className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isReviewModalOpen && (
                <AuthModel onClose={closeReviewModal}>
                    <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Rating:</label>
                        <div className="flex">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={`cursor-pointer text-2xl ${
                                        index < rating ? 'text-yellow-500' : 'text-gray-500'
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
                            onClick={closeReviewModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmitReview}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </AuthModel>
            )}

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
                            <button onClick={closeSidebar} className="text-white mb-6">
                                &times; Close
                            </button>
                            <h2 className="text-xl font-semibold mb-4">Registration Details</h2>
                            {selectedRegistration && (
                                <div>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Registration ID:</strong> {selectedRegistration.registration_id}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>User Name:</strong> {selectedRegistration.user_name}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Tournament Name:</strong> {selectedRegistration.tournament_name}</p>
                                    <p className='flex justify-between items-center border-b mb-2'><strong>Status:</strong> {selectedRegistration.status}</p>
                                    <button onClick={downloadInvoice} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Download Invoice
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tournaments;
