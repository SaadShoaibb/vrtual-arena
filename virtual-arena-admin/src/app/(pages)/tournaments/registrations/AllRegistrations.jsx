'use client';
import DynamicTable from '@/components/common/Table';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import EditRegistrationForm from './EditRegistrationForm';
import DetailView from '@/components/Detail';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

const Registrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [sidebarMode, setSidebarMode] = useState('view'); // 'view' or 'edit'
    const [selectedRow, setSelectedRow] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const columns = [
        { header: 'Registrant Name', accessor: 'registrant_name' },
        { header: 'Email', accessor: 'registrant_email' },
        {
            header: 'Type',
            accessor: 'registration_type',
            render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    value === 'Guest'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                    {value === 'Guest' ? '👤 Guest' : '🔐 User'}
                </span>
            )
        },
        { header: 'Tournament Name', accessor: 'tournament_name' },
        { header: 'Status', accessor: 'status' },
        { header: 'Payment Status', accessor: 'payment_status' },
        { header: 'Payment Option', accessor: 'payment_option' },
    ];

    const data = registrations.map((registration) => ({
        registration_id: registration.registration_id,
        user_id: registration.user_id,
        tournament_id: registration.tournament_id,
        status: registration.status,
        registrant_name: registration.registrant_name || registration.user_name || 'Unknown',
        registrant_email: registration.registrant_email || registration.email || 'N/A',
        registration_type: registration.registration_type || (registration.is_guest_registration ? 'Guest' : 'Registered User'),
        tournament_name: registration.tournament_name,
        payment_status: registration.payment_status || 'pending',
        payment_option: registration.payment_option || 'online',
    }));

    const handleFetchRegistrations = async () => {
        try {
            console.log('Fetching tournament registrations...');
            const response = await axios.get(`${API_URL}/admin/tournament-registrations/`, getAuthHeaders());
            console.log('Tournament registrations response:', response);
            setRegistrations(response?.data?.registrations || []);
            console.log(`✅ Loaded ${response?.data?.registrations?.length || 0} tournament registrations`);
        } catch (error) {
            console.error('Error fetching tournament registrations:', error);
            console.error('Error details:', error.response?.data);

            if (error.response?.status === 500) {
                toast.error('Database error. Please restart the server to apply migrations.');
            } else {
                toast.error('Error fetching tournament registrations');
            }
        }
    };

    useEffect(() => {
        handleFetchRegistrations();
    }, []);

    const handleDelete = (row) => {
        setSelectedRow(row);
        setDeleteModalOpen(true);
    };

    const handleSave = async (updatedRegistration) => {
        console.log(updatedRegistration);

        const payload = {
            user_id: updatedRegistration.user_id,
            tournament_id: updatedRegistration.tournament_id,
            status: updatedRegistration.status,
            payment_status: updatedRegistration.payment_status,
            payment_option: updatedRegistration.payment_option,
        };

        try {
            const response = await axios.put(
                `${API_URL}/admin/update-registration/${updatedRegistration?.registration_id}`,
                payload,
                getAuthHeaders()
            );

            if (response.status === 200) {
                toast.success('Registration Updated');
                handleFetchRegistrations();
                setSidebarOpen(false);
            } else {
                toast.error('Something went wrong.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(
                `${API_URL}/admin/delete-registration/${selectedRow.registration_id}`,
                getAuthHeaders()
            );

            if (response.status === 200) {
                toast.success('Registration Deleted');
                handleFetchRegistrations();
            } else {
                toast.error('Something went wrong.');
            }
        } catch (error) {
            console.log(error);
        }
        setDeleteModalOpen(false);
        setDropdownOpen(null);
    };

    const handleEdit = (row) => {
        setSelectedRegistration(row);
        setSidebarMode('edit');
        setSidebarOpen(true);
        setDropdownOpen(null);
        router.push(`/tournaments/registrations?registration_id=${row.registration_id}`);
    };

    const handleDetail = (row) => {
        setSelectedRegistration(row);
        setSidebarMode('view');
        setSidebarOpen(true);
        setDropdownOpen(null);
        router.push(`/tournaments/registrations?registration_id=${row.registration_id}`);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setSelectedRegistration(null);
        router.push('/tournaments/registrations');
    };

    // Check URL query on component mount
    useEffect(() => {
        const registrationId = searchParams.get('registration_id');
        if (registrationId) {
            const registration = registrations.find((r) => r.registration_id === parseInt(registrationId));
            if (registration) {
                setSelectedRegistration(registration);
                setSidebarOpen(true);
            }
        }
    }, [registrations, searchParams]);

    const registrationData = [
        { label: 'User Name', value: selectedRegistration?.user_name },
        { label: 'Tournament Name', value: selectedRegistration?.tournament_name },
        { label: 'Status', value: selectedRegistration?.status },
        { label: 'Payment Status', value: selectedRegistration?.payment_status || 'pending' },
        { label: 'Payment Option', value: selectedRegistration?.payment_option || 'online' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gradiant">Registrations</h1>
            <DynamicTable
                headers={columns}
                data={data}
                onEdit={handleEdit}
                onDetail={handleDetail}
                onDelete={handleDelete}
                onConfirm={confirmDelete}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                deleteModalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
            />

            {/* Sidebar with Framer Motion */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 min-h-screen w-1/2 bg-blackish2 border-l border-gray-200 p-6 z-50"
                    >
                        <button
                            onClick={closeSidebar}
                            className="text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <span className="min-h-6 min-w-6 rounded-full flex justify-center items-center bg-grad text-white font-bold">
                                &times;
                            </span>
                        </button>
                        {sidebarMode === 'edit' ? (
                            <EditRegistrationForm data={selectedRegistration} onSave={handleSave} />
                        ) : (
                            <DetailView data={registrationData} title="Registration Details" type="TOURNAMENT" id={selectedRegistration?.registration_id} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Registrations;