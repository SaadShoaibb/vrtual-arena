"use client"
import FieldContainer from '@/components/common/FieldContainer';
import Select from '@/components/common/Select';
import React, { useState } from 'react';

const EditEventRegistrationForm = ({ data, onSave }) => {
    const [formData, setFormData] = useState(data);

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
        { value: 'registered', label: 'Registered' },
        { value: 'attended', label: 'Attended' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const paymentStatusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
    ];

    return (
        <div className="bg-blackish2 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-gradiant">Edit Event Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <p className="text-white"><strong>Event:</strong> {data.event_name}</p>
                    <p className="text-white"><strong>User:</strong> {data.user_name} ({data.user_email})</p>
                    <p className="text-white"><strong>Registration Date:</strong> {new Date(data.registration_date).toLocaleDateString()}</p>
                </div>

                <FieldContainer label="Registration Status" htmlFor="status">
                    <Select
                        name="status"
                        value={formData.status || ''}
                        onChange={handleChange}
                        options={statusOptions}
                        required
                    />
                </FieldContainer>

                <FieldContainer label="Payment Status" htmlFor="payment_status">
                    <Select
                        name="payment_status"
                        value={formData.payment_status || ''}
                        onChange={handleChange}
                        options={paymentStatusOptions}
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

export default EditEventRegistrationForm;
