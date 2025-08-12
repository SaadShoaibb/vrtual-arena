'use client'
import Checkbox from '@/components/common/Checkbox';
import FieldContainer from '@/components/common/FieldContainer';
import Form from '@/components/common/Form';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateSession() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration_minutes: '',
        max_players: '',
        price: '',
        is_active: true,
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
            const response = await axios.post(`${API_URL}/admin/add-session`,formData,getAuthHeaders());
console.log(response)
            
            if (response.status == 201) {
                toast.success('Session created successfully!');
                // Reset form or redirect
                setFormData({
                    name: '',
                    description: '',
                    duration_minutes: '',
                    max_players: '',
                    price: '',
                    is_active: true,
                })
            } else {
                alert('Error creating session: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating session');
        }
    };
    // Removed hardcoded session options - now using text input for flexibility

    return (
        <div className="flex items-center justify-center">
            <div className="bg-blackish2 p-8 rounded-lg shadow-md w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-6 text-gradiant text-center">Create New Session</h1>
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FieldContainer label="Session Name" htmlFor="name">
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter session name (e.g., VR Racing Arena)"
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
                    <div className="flex items-center justify-between w-full">
                        <button
                            type="submit"
                            className="bg-grad w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Create Session
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}