"use client";
import Checkbox from '@/components/common/Checkbox';
import FieldContainer from '@/components/common/FieldContainer';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import React, { useState } from 'react';

const EditRegistrationForm = ({ data, onSave }) => {
    const [formData, setFormData] = useState(data);
    console.log(data);

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

    // Options for the status dropdown
    const statusOptions = [
        { value: '', label: 'Select a status' },
        { value: 'registered', label: 'Registered' },
        { value: 'pending', label: 'Pending' },
        { value: 'cancelled', label: 'Cancelled' },
    ];
    
    // Options for the payment status dropdown
    const paymentStatusOptions = [
        { value: '', label: 'Select payment status' },
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' },
    ];
    
    // Options for the payment option dropdown
    const paymentOptionOptions = [
        { value: '', label: 'Select payment option' },
        { value: 'online', label: 'Online' },
        { value: 'at_event', label: 'Pay at Event' },
    ];

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* User ID Field */}
                    <FieldContainer label="User ID" htmlFor="user_id">
                        <Input
                            type="text"
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            required
                            disabled // Assuming user_id cannot be changed
                        />
                    </FieldContainer>

                    {/* Tournament ID Field */}
                    <FieldContainer label="Tournament ID" htmlFor="tournament_id">
                        <Input
                            type="text"
                            name="tournament_id"
                            value={formData.tournament_id}
                            onChange={handleChange}
                            required
                            disabled // Assuming tournament_id cannot be changed
                        />
                    </FieldContainer>

                    {/* Status Field */}
                    <FieldContainer label="Status" htmlFor="status">
                        <Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            options={statusOptions}
                            required
                        />
                    </FieldContainer>
                    
                    {/* Payment Status Field */}
                    <FieldContainer label="Payment Status" htmlFor="payment_status">
                        <Select
                            name="payment_status"
                            value={formData.payment_status || ''}
                            onChange={handleChange}
                            options={paymentStatusOptions}
                        />
                    </FieldContainer>
                    
                    {/* Payment Option Field */}
                    <FieldContainer label="Payment Option" htmlFor="payment_option">
                        <Select
                            name="payment_option"
                            value={formData.payment_option || 'online'}
                            onChange={handleChange}
                            options={paymentOptionOptions}
                        />
                    </FieldContainer>
                </div>
            </div>
            {/* Save Button */}
            <button
                type="submit"
                className="bg-grad w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Save Changes
            </button>
        </form>
    );
};

export default EditRegistrationForm;