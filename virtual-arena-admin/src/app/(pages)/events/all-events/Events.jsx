'use client'
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import DetailView from '@/components/Detail';
import DynamicTable from '@/components/common/Table';
import EditEventForm from './EditEventForm';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarMode, setSidebarMode] = useState('detail'); // 'detail' or 'edit'
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [eventData, setEventData] = useState({});

    const handleFetchEvents = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/get-events/`, getAuthHeaders());
            if (response.status === 200) {
                setEvents(response.data.events || []);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Error fetching events');
        }
    };

    useEffect(() => {
        handleFetchEvents();
    }, []);

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setSidebarMode('edit');
        setSidebarOpen(true);
        setDropdownOpen(null); // Close dropdown when opening edit form
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            // Use a consistent format that works on both server and client
            return date.toISOString().replace('T', ' ').substring(0, 19);
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const handleDetail = (event) => {
        setSelectedEvent(event);

        // Transform event data to the format expected by DetailView
        const formattedEventData = [
            { label: 'Event ID', value: event.event_id },
            { label: 'Name', value: event.name },
            { label: 'Description', value: event.description || 'N/A' },
            { label: 'Event Type', value: event.event_type },
            { label: 'Start Date', value: formatDate(event.start_date) },
            { label: 'End Date', value: formatDate(event.end_date) },
            { label: 'City', value: event.city },
            { label: 'State', value: event.state },
            { label: 'Country', value: event.country },
            { label: 'Ticket Price', value: `$${parseFloat(event.ticket_price || 0).toFixed(2)}` },
            { label: 'Max Participants', value: event.max_participants || 'Unlimited' },
            { label: 'Registered Count', value: event.registered_count || 0 },
            { label: 'Status', value: event.status },
            { label: 'Created At', value: formatDate(event.created_at) },
            { label: 'Updated At', value: formatDate(event.updated_at) }
        ];

        setEventData(formattedEventData);
        setSidebarMode('detail');
        setSidebarOpen(true);
        setDropdownOpen(null); // Close dropdown when opening detail view
    };

    const handleDelete = (event) => {
        setSelectedEvent(event);
        setDeleteModalOpen(true);
        setDropdownOpen(null); // Close dropdown when opening delete modal
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/admin/delete-event/${selectedEvent?.event_id}`, getAuthHeaders());
            if (response.status === 200) {
                toast.success('Event deleted successfully');
                handleFetchEvents();
                setDeleteModalOpen(false);
                setSelectedEvent(null);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error deleting event');
            }
        }
    };

    const handleSave = async (updatedEvent) => {
        const formatToMySQLDateTime = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        const payload = {
            name: updatedEvent.name,
            description: updatedEvent.description,
            start_date: formatToMySQLDateTime(updatedEvent.start_date),
            end_date: formatToMySQLDateTime(updatedEvent.end_date),
            city: updatedEvent.city,
            state: updatedEvent.state,
            country: updatedEvent.country,
            ticket_price: updatedEvent.ticket_price,
            max_participants: updatedEvent.max_participants,
            event_type: updatedEvent.event_type,
            status: updatedEvent.status
        };

        try {
            const response = await axios.put(`${API_URL}/admin/update-event/${updatedEvent?.event_id}`, payload, getAuthHeaders());

            if (response.status === 200) {
                toast.success('Event Updated');
                handleFetchEvents();
                setSidebarOpen(false);
            } else {
                toast.error('Something went wrong.');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error('Error updating event');
        }
    };

    const columns = [
        { accessor: 'event_id', header: 'ID' },
        { accessor: 'name', header: 'Event Name' },
        { accessor: 'event_type', header: 'Type' },
        { accessor: 'start_date', header: 'Start Date', render: (value) => new Date(value).toLocaleDateString() },
        { accessor: 'end_date', header: 'End Date', render: (value) => new Date(value).toLocaleDateString() },
        { accessor: 'city', header: 'City' },
        { accessor: 'ticket_price', header: 'Price', render: (value) => `$${parseFloat(value).toFixed(2)}` },
        { accessor: 'registered_count', header: 'Registered' },
        { accessor: 'status', header: 'Status', render: (value) => (
            <span className={`px-2 py-1 rounded text-xs ${
                value === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                value === 'ongoing' ? 'bg-green-100 text-green-800' :
                value === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
            }`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
        )},
    ];

    const data = events.map(event => ({
        ...event,
        registered_count: event.registered_count || 0
    }));

    return (
        <div className="p-2 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gradiant">Events</h1>
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
                            onClick={() => {
                                setSidebarOpen(false);
                                setDropdownOpen(null); // Close dropdown when closing sidebar
                            }}
                            className="text-gray-500 hover:text-gray-700 mb-4"
                        >
                            <span className='min-h-6 min-w-6 rounded-full flex justify-center items-center bg-grad text-white font-bold'>&times;</span>
                        </button>
                        {sidebarMode === 'edit' ? (
                            <EditEventForm data={selectedEvent} onSave={handleSave} />
                        ) : (
                            <DetailView data={eventData} title='Event Details' type="EVENT" id={selectedEvent?.event_id} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
