"use client"
import Checkbox from '@/components/common/Checkbox';
import FieldContainer from '@/components/common/FieldContainer';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import React, { useState } from 'react';

const EditBookingForm = ({ data, onSave }) => {
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

  
    const sessionOptions = [
        { value: '', label: 'Select a session' },
        { value: 'Free Roaming VR Arena 2.0', label: 'Free Roaming VR Arena 2.0' },
        { value: 'VR UFO 5 Players', label: 'VR UFO 5 Players' },
        { value: 'VR 360° Motion Chair', label: 'VR 360° Motion Chair' },
        { value: 'HTC VIVE VR Standing Platform', label: 'HTC VIVE VR Standing Platform' },
        { value: 'VR Warrior 2players', label: 'VR Warrior 2players' },
        { value: 'VR CAT', label: 'VR CAT' },
    ];
    const paymentOptions = [
        { value: '', label: 'Select a Payment status' },
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'cancelled', label: 'Cancel' },
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