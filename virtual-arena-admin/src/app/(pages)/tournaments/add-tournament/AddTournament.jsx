'use client'
import FieldContainer from '@/components/common/FieldContainer';
import Form from '@/components/common/Form';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import TextArea from '@/components/common/TextArea';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const AddTournament = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        city: '',
        state: '',
        country: '',
        ticket_price: '',
        max_participants: '',
        prize_pool: '',
        game_type: '',
        rules: '',
        requirements: '',
        status: 'upcoming',
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
            const response = await axios.post(`${API_URL}/admin/add-tournament`, formData, getAuthHeaders());
            console.log(response)

            if (response.status == 201) {
                toast.success('Tournament Added successfully!');
                // Reset form or redirect
                setFormData({
                    name: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    city: '',
                    state: '',
                    country: '',
                    ticket_price: '',
                    max_participants: '',
                    prize_pool: '',
                    game_type: '',
                    rules: '',
                    requirements: '',
                    status: 'upcoming',
                })
            } else {
                alert('Error creating session: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            // alert('Error creating session');
        }
    };

    const statusOptions = [
        { value: '', label: 'Select Status' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'ongoing', label: 'Ongoing' },
    ];
    return (
        <div className="flex items-center justify-center">
            <div className="bg-blackish2 p-8 rounded-lg shadow-md w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 text-gradiant text-center">Add A Tournament</h1>
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FieldContainer label="Tournament Title" htmlFor="name">
                            <Input
                                type="text"
                                name="name"
                                placeholder='Enter Title Here...'
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Game Type" htmlFor="game_type">
                            <Input
                                type="text"
                                name="game_type"
                                placeholder='Enter Game Type...'
                                value={formData.game_type}
                                onChange={handleChange}
                            />
                        </FieldContainer>
                      
                        <FieldContainer label="Ticket Price" htmlFor="ticket_price">
                            <Input
                                type="number"
                                step="0.01"
                                placeholder='Enter Ticket Price here'
                                name="ticket_price"
                                value={formData.ticket_price}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="Prize Pool" htmlFor="prize_pool">
                            <Input
                                type="number"
                                step="0.01"
                                placeholder='Enter Prize Pool (optional)'
                                name="prize_pool"
                                value={formData.prize_pool}
                                onChange={handleChange}
                            />
                        </FieldContainer>

                        <FieldContainer label="Max Participants" htmlFor="max_participants">
                            <Input
                                type="number"
                                placeholder='Enter Max Participants (optional)'
                                name="max_participants"
                                value={formData.max_participants}
                                onChange={handleChange}
                            />
                        </FieldContainer>
                        

                        <FieldContainer label="Start Time" htmlFor="start_date">
                            <Input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>

                        <FieldContainer label="End Time" htmlFor="end_date">
                            <Input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                      

                        <FieldContainer label="Status" htmlFor="status">
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={statusOptions}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="City" htmlFor="city">
                            <Input
                                type="text"
                                name="city"
                                placeholder='City'
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="State" htmlFor="state">
                            <Input
                                type="text"
                                name="state"
                                placeholder='state'
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                        <FieldContainer label="Country" htmlFor="country">
                            <Input
                                type="text"
                                name="country"
                                placeholder='Country'
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                    </div>

                    <div className="mt-4">
                        <FieldContainer label="Tournament Description" htmlFor="description">
                            <TextArea
                                name="description"
                                placeholder='Enter Tournament Description...'
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                            />
                        </FieldContainer>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <FieldContainer label="Tournament Rules" htmlFor="rules">
                            <TextArea
                                name="rules"
                                placeholder='Enter Tournament Rules...'
                                value={formData.rules}
                                onChange={handleChange}
                                rows={4}
                            />
                        </FieldContainer>

                        <FieldContainer label="Requirements" htmlFor="requirements">
                            <TextArea
                                name="requirements"
                                placeholder='Enter Requirements...'
                                value={formData.requirements}
                                onChange={handleChange}
                                rows={4}
                            />
                        </FieldContainer>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-grad text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Add Tournament
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default AddTournament
