'use client'
import FieldContainer from '@/components/common/FieldContainer';
import Form from '@/components/common/Form';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import TextArea from '@/components/common/TextArea';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const AddEvent = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        city: '',
        state: '',
        country: '',
        ticket_price: '',
        max_participants: '',
        event_type: 'other',
        status: 'upcoming',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/admin/add-event`, formData, getAuthHeaders());

            if (response.status === 201) {
                toast.success('Event Added successfully!');
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    city: '',
                    state: '',
                    country: '',
                    ticket_price: '',
                    max_participants: '',
                    event_type: 'other',
                    status: 'upcoming',
                });
            } else {
                toast.error('Error creating event: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error creating event');
        }
    };

    const statusOptions = [
        { value: '', label: 'Select Status' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const eventTypeOptions = [
        { value: '', label: 'Select Event Type' },
        { value: 'party', label: 'Party' },
        { value: 'corporate', label: 'Corporate Event' },
        { value: 'birthday', label: 'Birthday Party' },
        { value: 'special', label: 'Special Event' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <div className="flex items-center justify-center">
            <div className="bg-blackish2 p-8 rounded-lg shadow-md w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 text-gradiant text-center">Add An Event</h1>
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FieldContainer label="Event Title" htmlFor="name">
                            <Input
                                type="text"
                                name="name"
                                placeholder='Enter Event Title Here...'
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Event Type" htmlFor="event_type">
                            <Select
                                name="event_type"
                                value={formData.event_type}
                                onChange={handleChange}
                                options={eventTypeOptions}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Ticket Price" htmlFor="ticket_price">
                            <Input
                                type="number"
                                step="0.01"
                                placeholder='Enter Ticket Price here'
                                name="ticket_price"
                                value={formData.ticket_price}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Max Participants" htmlFor="max_participants">
                            <Input
                                type="number"
                                placeholder='Enter Max Participants (optional)'
                                name="max_participants"
                                value={formData.max_participants}
                                onChange={handleChange}
                            />
                        </FieldContainer>

                        <FieldContainer label="Start Date" htmlFor="start_date">
                            <Input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="End Date" htmlFor="end_date">
                            <Input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="City" htmlFor="city">
                            <Input
                                type="text"
                                placeholder='Enter City'
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="State/Province" htmlFor="state">
                            <Input
                                type="text"
                                placeholder='Enter State/Province'
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Country" htmlFor="country">
                            <Input
                                type="text"
                                placeholder='Enter Country'
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Status" htmlFor="status">
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={statusOptions}
                                required
                            />
                        </FieldContainer>
                    </div>

                    <div className="mt-4">
                        <FieldContainer label="Event Description" htmlFor="description">
                            <TextArea
                                name="description"
                                placeholder='Enter Event Description...'
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </FieldContainer>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-grad text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Add Event
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AddEvent;
