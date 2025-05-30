"use client"
import Checkbox from '@/components/common/Checkbox';
import FieldContainer from '@/components/common/FieldContainer';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import React, { useState } from 'react';

const EditTournamentForm = ({ data, onSave }) => {
    const [formData, setFormData] = useState(data);
console.log(data)
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

const paymentOptions = [
    { value: '', label: 'Select a Payment status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
];
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FieldContainer label="Name" htmlFor="name">
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="Start Date" htmlFor="start_date">
                            <Input
                                type="datetime-local"
                                name="start_date"
                                value={formatDateTimeForInput(formData.start_date)}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="End Date" htmlFor="end_date">
                            <Input
                                type="datetime-local"
                                name="end_date"
                                value={formatDateTimeForInput(formData.end_date)}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Status" htmlFor="status">
                        <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={paymentOptions}
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

export default EditTournamentForm;