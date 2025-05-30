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