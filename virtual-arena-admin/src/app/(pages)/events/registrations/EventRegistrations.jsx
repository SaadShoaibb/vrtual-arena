'use client'
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import DetailView from '@/components/Detail';
import DynamicTable from '@/components/common/Table';
import EditEventRegistrationForm from './EditEventRegistrationForm';

// Helper function to safely format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString();
    } catch (error) {
        return 'Invalid Date';
    }
};

const EventRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarMode, setSidebarMode] = useState('detail'); // 'detail' or 'edit'
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [registrationData, setRegistrationData] = useState({});
    const [isClient, setIsClient] = useState(false);

    // Prevent hydration issues
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleFetchRegistrations = async () => {
        try {
            console.log('Fetching event registrations...');
            const response = await axios.get(`${API_URL}/admin/event-registrations/`, getAuthHeaders());
            console.log('Event registrations response:', response);
            if (response.status === 200) {
                setRegistrations(response.data.registrations || []);
                console.log(`✅ Loaded ${response.data.registrations?.length || 0} event registrations`);
            }
        } catch (error) {
            console.error('Error fetching event registrations:', error);
            console.error('Error details:', error.response?.data);

            if (error.response?.status === 500) {
                toast.error('Database error. Please restart the server to apply migrations.');
            } else {
                toast.error('Error fetching event registrations');
            }
        }
    };

    useEffect(() => {
        handleFetchRegistrations();
    }, []);

    const handleEdit = (registration) => {
        setSelectedRegistration(registration);
        setSidebarMode('edit');
        setSidebarOpen(true);
    };

    const handleDetail = (registration) => {
        setSelectedRegistration(registration);
        setRegistrationData(registration);
        setSidebarMode('detail');
        setSidebarOpen(true);
    };

    const handleDelete = (registration) => {
        setSelectedRegistration(registration);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/admin/delete-event-registration/${selectedRegistration?.registration_id}`, getAuthHeaders());
            if (response.status === 200) {
                toast.success('Event registration deleted successfully');
                handleFetchRegistrations();
                setDeleteModalOpen(false);
                setSelectedRegistration(null);
            }
        } catch (error) {
            console.error('Error deleting event registration:', error);
            toast.error('Error deleting event registration');
        }
    };

    const handleSave = async (updatedRegistration) => {
        const payload = {
            status: updatedRegistration.status,
            payment_status: updatedRegistration.payment_status
        };

        try {
            const response = await axios.put(`${API_URL}/admin/update-event-registration/${updatedRegistration?.registration_id}`, payload, getAuthHeaders());

            if (response.status === 200) {
                toast.success('Event Registration Updated');
                handleFetchRegistrations();
                setSidebarOpen(false);
            } else {
                toast.error('Something went wrong.');
            }
        } catch (error) {
            console.error('Error updating event registration:', error);
            toast.error('Error updating event registration');
        }
    };

    const columns = [
        { key: 'registration_id', label: 'ID' },
        { key: 'event_name', label: 'Event Name' },
        { key: 'registrant_name', label: 'Registrant Name' },
        { key: 'registrant_email', label: 'Email' },
        { key: 'registration_type', label: 'Type', render: (value) => (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
                value === 'Guest'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
                {value === 'Guest' ? '👤 Guest' : '🔐 User'}
            </span>
        )},
        { key: 'registration_date', label: 'Registration Date', render: (value) => formatDate(value) },
        { key: 'payment_status', label: 'Payment Status', render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
                value === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
                {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending'}
            </span>
        )},
        { key: 'status', label: 'Status', render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
                value === 'registered' ? 'bg-blue-100 text-blue-800' :
                value === 'attended' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
            }`}>
                {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'}
            </span>
        )},
    ];

    // Debug logging
    console.log('Raw registrations data:', registrations);

    // Transform registrations data to match column keys
    const data = registrations.map((registration) => {
        console.log('Processing registration:', registration);
        return {
            registration_id: registration.registration_id,
            event_name: registration.event_name || 'Unknown Event',
            registrant_name: registration.registrant_name || registration.user_name || 'Unknown',
            registrant_email: registration.registrant_email || registration.email || 'N/A',
            registration_type: registration.registration_type || (registration.is_guest_registration ? 'Guest' : 'Registered User'),
            registration_date: registration.registration_date || registration.created_at,
            payment_status: registration.payment_status || 'pending',
            status: registration.status || 'registered',
            // Keep original data for edit/detail operations
            ...registration
        };
    });

    console.log('Transformed data:', data);

    // Show loading state during hydration
    if (!isClient) {
        return (
            <div className="p-2 md:p-6">
                <h1 className="text-2xl font-bold mb-6 text-gradiant">Event Registrations</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gradiant">Event Registrations</h1>
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
            {sidebarOpen && (
                <div className='fixed right-0 top-0 min-h-screen w-1/2'>
                    <div className={`w-full absolute right-0 transform transition-transform duration-300 ease-in-out top-0 h-screen bg-blackish2 border-l ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                        } border-gray-200 p-6`}>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <span className='min-h-6 min-w-6 rounded-full flex justify-center items-center bg-grad text-white font-bold'>&times;</span>
                        </button>
                        {sidebarMode === 'edit' ? (
                            <EditEventRegistrationForm data={selectedRegistration} onSave={handleSave} />
                        ) : (
                            <DetailView data={registrationData} title='Event Registration Details' type="EVENT_REGISTRATION" id={selectedRegistration?.registration_id} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventRegistrations;
