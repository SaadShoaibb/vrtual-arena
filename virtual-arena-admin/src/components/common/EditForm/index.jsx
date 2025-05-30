"use client"
import React, { useState } from 'react';
import FieldContainer from '../FieldContainer';
import Select from '../Select';
import Input from '../Input';
import Checkbox from '../Checkbox';

const EditForm = ({ data, onSave }) => {
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
   
    const sessionOptions = [
        { value: '', label: 'Select a session' },
        { value: 'Free Roaming VR Arena 2.0', label: 'Free Roaming VR Arena 2.0' },
        { value: 'VR UFO 5 Players', label: 'VR UFO 5 Players' },
        { value: 'VR 360° Motion Chair', label: 'VR 360° Motion Chair' },
        { value: 'HTC VIVE VR Standing Platform', label: 'HTC VIVE VR Standing Platform' },
        { value: 'VR Warrior 2players', label: 'VR Warrior 2players' },
        { value: 'VR CAT', label: 'VR CAT' },
    ];
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FieldContainer label="Session Name" htmlFor="name">
                            <Select
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                options={sessionOptions}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="Duration (minutes)" htmlFor="duration_minutes">
                            <Input
                                type="number"
                                name="duration_minutes"
                                value={formData.duration_minutes}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="Max Players" htmlFor="max_players">
                            <Input
                                type="number"
                                name="max_players"
                                value={formData.max_players}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Price" htmlFor="price">
                            <Input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Description" htmlFor="description">
                            <Input
                                type="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <Checkbox
                        htmlFor={'is_active'}
                                name="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                label="Active"
                            />
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

export default EditForm;