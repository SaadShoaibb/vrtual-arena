"use client"
import React, { useState, useEffect } from 'react';
import FieldContainer from '../FieldContainer';
import Select from '../Select';
import Input from '../Input';
import Checkbox from '../Checkbox';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import toast from 'react-hot-toast';

const EditForm = ({ data, onSave }) => {
    const [formData, setFormData] = useState(data || {});
    const [sessionPricing, setSessionPricing] = useState({
        1: '',
        2: ''
    });

    // Fetch session pricing when component mounts
    useEffect(() => {
        if (data?.session_id) {
            fetchSessionPricing();
        }
    }, [data?.session_id]);

    const fetchSessionPricing = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/sessions/pricing/${data.session_id}`, getAuthHeaders());
            if (response.data.success) {
                const pricing = {};
                response.data.pricing.forEach(item => {
                    pricing[item.session_count] = item.price;
                });
                setSessionPricing(pricing);
            }
        } catch (error) {
            console.log('Error fetching session pricing:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePricingChange = (sessionCount, value) => {
        setSessionPricing({
            ...sessionPricing,
            [sessionCount]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Save session data first
            await onSave(formData);

            // Then save pricing data
            await updateSessionPricing();

            toast.success('Session and pricing updated successfully');
        } catch (error) {
            console.error('Error saving session:', error);
            toast.error('Failed to update session');
        }
    };

    const updateSessionPricing = async () => {
        try {
            // Update 1 session pricing
            if (sessionPricing[1] !== undefined && sessionPricing[1] !== '') {
                await axios.put(`${API_URL}/admin/sessions/admin-pricing`, {
                    session_id: data.session_id,
                    session_count: 1,
                    price: parseFloat(sessionPricing[1])
                }, getAuthHeaders());
            }

            // Update 2 session pricing (only if not Photo Booth)
            if (data.name !== 'Photo Booth' && sessionPricing[2] !== undefined && sessionPricing[2] !== '') {
                await axios.put(`${API_URL}/admin/sessions/admin-pricing`, {
                    session_id: data.session_id,
                    session_count: 2,
                    price: parseFloat(sessionPricing[2])
                }, getAuthHeaders());
            }
        } catch (error) {
            console.error('Error updating session pricing:', error);
            throw error;
        }
    };
   
    // For editing, we use text input instead of dropdown to allow any session name
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FieldContainer label="Session Name" htmlFor="name">
                            <Input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                placeholder="Enter session name"
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="Duration (minutes)" htmlFor="duration_minutes">
                            <Input
                                type="number"
                                name="duration_minutes"
                                value={formData.duration_minutes || ''}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="Max Players" htmlFor="max_players">
                            <Input
                                type="number"
                                name="max_players"
                                value={formData.max_players || ''}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="1 Session Price" htmlFor="price_1_session">
                            <Input
                                type="number"
                                step="0.01"
                                name="price_1_session"
                                value={sessionPricing[1] || ''}
                                onChange={(e) => handlePricingChange(1, e.target.value)}
                                placeholder="Enter 1 session price"
                                required
                            />
                        </FieldContainer>

                        {/* Only show 2 session pricing for non-Photo Booth sessions */}
                        {formData.name !== 'Photo Booth' && (
                            <FieldContainer label="2 Sessions Price" htmlFor="price_2_sessions">
                                <Input
                                    type="number"
                                    step="0.01"
                                    name="price_2_sessions"
                                    value={sessionPricing[2] || ''}
                                    onChange={(e) => handlePricingChange(2, e.target.value)}
                                    placeholder="Enter 2 sessions price"
                                    required
                                />
                            </FieldContainer>
                        )}

                        <FieldContainer label="Description" htmlFor="description">
                            <Input
                                type="textarea"
                                name="description"
                                value={formData.description || ''}
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