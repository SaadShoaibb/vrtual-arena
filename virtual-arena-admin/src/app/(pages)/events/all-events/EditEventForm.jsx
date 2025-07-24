"use client"
import FieldContainer from '@/components/common/FieldContainer';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import TextArea from '@/components/common/TextArea';
import React, { useState } from 'react';

const EditEventForm = ({ data, onSave }) => {
    const [formData, setFormData] = useState({
        ...data,
        start_date: data.start_date ? new Date(data.start_date).toISOString().slice(0, 16) : '',
        end_date: data.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : '',
    });

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

    const statusOptions = [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const eventTypeOptions = [
        { value: 'party', label: 'Party' },
        { value: 'corporate', label: 'Corporate Event' },
        { value: 'birthday', label: 'Birthday Party' },
        { value: 'special', label: 'Special Event' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <div className="bg-blackish2 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-gradiant">Edit Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FieldContainer label="Event Name" htmlFor="name">
                    <Input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        required
                    />
                </FieldContainer>

                <FieldContainer label="Event Type" htmlFor="event_type">
                    <Select
                        name="event_type"
                        value={formData.event_type || ''}
                        onChange={handleChange}
                        options={eventTypeOptions}
                        required
                    />
                </FieldContainer>

                <FieldContainer label="Description" htmlFor="description">
                    <TextArea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows={3}
                    />
                </FieldContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FieldContainer label="City" htmlFor="city">
                        <Input
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>

                    <FieldContainer label="State" htmlFor="state">
                        <Input
                            type="text"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>

                    <FieldContainer label="Country" htmlFor="country">
                        <Input
                            type="text"
                            name="country"
                            value={formData.country || ''}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldContainer label="Ticket Price" htmlFor="ticket_price">
                        <Input
                            type="number"
                            step="0.01"
                            name="ticket_price"
                            value={formData.ticket_price || ''}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>

                    <FieldContainer label="Max Participants" htmlFor="max_participants">
                        <Input
                            type="number"
                            name="max_participants"
                            value={formData.max_participants || ''}
                            onChange={handleChange}
                        />
                    </FieldContainer>
                </div>

                <FieldContainer label="Status" htmlFor="status">
                    <Select
                        name="status"
                        value={formData.status || ''}
                        onChange={handleChange}
                        options={statusOptions}
                        required
                    />
                </FieldContainer>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="submit"
                        className="bg-grad text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEventForm;
