"use client";
import Checkbox from '@/components/common/Checkbox';
import FieldContainer from '@/components/common/FieldContainer';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import React, { useState } from 'react';

const EditUserForm = ({ data, onSave }) => {
    const [formData, setFormData] = useState(data);

    console.log(data); // Debugging: Log the current user data

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Handle checkbox inputs separately
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

    // Format the birthday to YYYY-MM-DD before saving
    const formattedData = {
        ...formData,
        birthday: formData.birthday ? new Date(formData.birthday).toISOString().split('T')[0] : null,
    };

    onSave(formattedData); // Pass the formatted data to the parent component
    };

    // Function to format date for the date input field
    const formatDateForInput = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
    };

    // Role options for the dropdown
    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'staff', label: 'Staff' },
        { value: 'customer', label: 'Customer' },
    ];

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <FieldContainer label="Name" htmlFor="name">
                        <Input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>

                    {/* Email Field */}
                    <FieldContainer label="Email" htmlFor="email">
                        <Input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </FieldContainer>

                    {/* Phone Field */}
                    <FieldContainer label="Phone" htmlFor="phone">
                        <Input
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                        />
                    </FieldContainer>

                    {/* Birthday Field */}
                    <FieldContainer label="Birthday" htmlFor="birthday">
                        <Input
                            type="date"
                            name="birthday"
                            value={formatDateForInput(formData.birthday)}
                            onChange={handleChange}
                        />
                    </FieldContainer>

                    {/* Role Field */}
                    <FieldContainer label="Role" htmlFor="role">
                        <Select
                            name="role"
                            value={formData.role || 'customer'}
                            onChange={handleChange}
                            options={roleOptions}
                            required
                        />
                    </FieldContainer>

                    {/* Active Status Checkbox */}
                    <FieldContainer label="Active" htmlFor="is_active">
                        <Checkbox
                            name="is_active"
                            checked={formData.is_active || false}
                            onChange={handleChange}
                        />
                    </FieldContainer>

                    {/* Blocked Status Checkbox */}
                    <FieldContainer label="Blocked" htmlFor="is_blocked">
                        <Checkbox
                            name="is_blocked"
                            checked={formData.is_blocked || false}
                            onChange={handleChange}
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

export default EditUserForm;