"use client";
import DetailView from '@/components/Detail';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import PaymentTable from './PaymentTable';

const Payments = () => {
    // Table columns
    const columns = [
        { header: 'Payment ID', accessor: 'payment_id' },
        { header: 'Amount', accessor: 'amount' },
        { header: 'Status', accessor: 'status' },
        { header: 'Payment Date', accessor: 'created_at' },
        { header: 'User', accessor: 'user_name' },
        { header: 'Entity Type', accessor: 'entity_type' },
        { header: 'Entity ID', accessor: 'entity_id' },
    ];

    // State for payments
    const [payments, setPayments] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filteredPayments, setFilteredPayments] = useState(payments);
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Transform payments data for the table
    const data = filteredPayments?.map((payment) => ({
        payment_id: payment?.payment_id,
        amount: `$${payment?.amount}`,
        status: payment?.status,
        created_at: new Date(payment?.created_at).toLocaleDateString(),
        user_name: payment?.user_id,
        entity_type: payment?.entity_type,
        entity_id: payment?.entity_id,
    }));

    // State for sidebar and selected payment
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);

    // Filter options
    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'succeeded', label: 'Succeeded' },
        { value: 'failed', label: 'Failed' },
    ];

    // Handle filter change
    const handleFilterChange = (e) => {
        const status = e.target.value;
        setSelectedFilter(status);

        if (status === 'all') {
            setFilteredPayments(payments); // Show all payments
        } else {
            const filtered = payments.filter((payment) => payment.status === status);
            setFilteredPayments(filtered); // Filter by status
        }
    };

    // Fetch payments from the backend
    const handleFetchPayments = async () => {
        try {
            const response = await axios.get(`${API_URL}/payment/payment-details`, getAuthHeaders());
            setPayments(response.data.payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to fetch payments.');
        }
    };

    useEffect(() => {
        handleFetchPayments();
    }, []);

    // Initialize filteredPayments with all payments when the component mounts
    useEffect(() => {
        setFilteredPayments(payments);
    }, [payments]);

    // Handle detail view action
    const handleDetail = (row) => {
        setSelectedPayment(row);
        setSidebarOpen(true);
        setDropdownOpen(null);
        router.push(`/payments?payment_id=${row?.payment_id}`);
    };

    const handleClosesidebar = () => {
        setSidebarOpen(false);
        router.push(`/payments`);
    };

    // Check URL query on component mount
    useEffect(() => {
        const paymentId = searchParams.get('payment_id');
        if (paymentId) {
            const payment = payments.find((p) => p.payment_id === parseInt(paymentId));
            if (payment) {
                setSelectedPayment(payment);
                setSidebarOpen(true);
            }
        }
    }, [payments, searchParams]);
    const sessionData = [
        { label: "Payment Id", value: selectedPayment?.payment_id },
        { label: "Amount", value: selectedPayment?.amount },
        { label: "Status", value: selectedPayment?.stripe_payment_status },
        { label: "Currency", value: selectedPayment?.currency },
        { label: "Entity Id", value: selectedPayment?.entity_id },
        { label: "Entit Type", value: selectedPayment?.entity_type },
    ];
    return (
        <div className="p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-6 text-gradiant">Payments</h1>
                {/* Filter Menu */}
                <div className="relative">
                    <select
                        value={selectedFilter}
                        onChange={handleFilterChange}
                        className="block appearance-none w-48 bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
                    >
                        {filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
            <PaymentTable
                headers={columns}
                data={data}
                onDetail={handleDetail}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
            />

            {/* Sidebar with Framer Motion */}
            <AnimatePresence>
                {sidebarOpen && (
                    <div className="fixed right-0 top-0 min-h-screen overflow-y-auto w-1/2">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 min-h-screen w-1/2 bg-blackish2 border-l border-gray-200 p-6 z-50"
                        >
                            <button
                                onClick={handleClosesidebar}
                                className="text-gray-500 hover:text-gray-700 mb-4"
                            >
                                <span className="min-h-6 min-w-6 rounded-full flex justify-center items-center bg-grad text-white font-bold">
                                    &times;
                                </span>
                            </button>
                            <DetailView data={sessionData} title='Session Details' />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Payments;