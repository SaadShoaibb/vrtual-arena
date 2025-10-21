"use client"
import Checkbox from '@/components/common/Checkbox';
import FieldContainer from '@/components/common/FieldContainer';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';

const EditBookingForm = ({ data, onSave }) => {
    const [formData, setFormData] = useState(data);
    const [sessions, setSessions] = useState([]);

    console.log(data)

    // Fetch sessions from API
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/get-sessions/`, getAuthHeaders());
                setSessions(response?.data?.sessions || []);
            } catch (error) {
                console.log('Error fetching sessions:', error);
            }
        };
        fetchSessions();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    // Function to convert ISO date to datetime-local format
   // Function to convert ISO date to datetime-local format
   const formatDateTimeForInput = (isoDate) => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    
    // Get local date and time components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit format
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Return formatted string: "YYYY-MM-DDTHH:MM" (required format for datetime-local)
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

    // Generate session options dynamically from fetched sessions
    const sessionOptions = [
        { value: '', label: 'Select a session' },
        ...sessions.map(session => ({
            value: session.name,
            label: session.name
        }))
    ];
    const paymentOptions = [
        { value: '', label: 'Select a Payment status' },
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'cancelled', label: 'Cancelled' },
    ];
    
    const sessionStatusOptions = [
        { value: '', label: 'Select Session Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'started', label: 'Started' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FieldContainer label="Machine Type" htmlFor="machine_type">
                            <Select
                                name="machine_type"
                                value={formData.machine_type}
                                onChange={handleChange}
                                options={sessionOptions}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="Start Time" htmlFor="start_time">
                            <Input
                                type="datetime-local"
                                name="start_time"
                                value={formatDateTimeForInput(formData.start_time)}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="End Time" htmlFor="end_time">
                            <Input
                                type="datetime-local"
                                name="end_time"
                                value={formatDateTimeForInput(formData.end_time)}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Payment Status" htmlFor="payment_status">
                        <Select
                                name="payment_status"
                                value={formData.payment_status}
                                onChange={handleChange}
                                options={paymentOptions}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Session Status" htmlFor="session_status">
                        <Select
                                name="session_status"
                                value={formData.session_status || 'pending'}
                                onChange={handleChange}
                                options={sessionStatusOptions}
                                required
                            />
                        </FieldContainer>
            </div>
            </div>
            {/* Add other fields here */}
            <button
                 type="submit"
                 className="bg-grad w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Save Changes
            </button>
        </form>
    );
};

export default EditBookingForm;