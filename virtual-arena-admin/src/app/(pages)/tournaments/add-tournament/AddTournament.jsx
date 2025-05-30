'use client'
import FieldContainer from '@/components/common/FieldContainer';
import Form from '@/components/common/Form';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const AddTournament = () => {
    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        city:'',
        state:'',
        country:'',
        ticket_price:'',
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
                    start_date: '',
                    end_date: '',
                    city:'',
                    state:'',
                    country:'',
                    ticket_price:'',
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
            <div className="bg-blackish2 p-8 rounded-lg shadow-md w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-6 text-gradiant text-center">Add A Tournament</h1>
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FieldContainer label="Tournaent Title" htmlFor="name">
                            <Input
                                type="text"
                                name="name"
                                placeholder='Enter Title Here...'
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </FieldContainer>
                      
                        <FieldContainer label="Ticket Price" htmlFor="ticket_price">
                            <Input
                                type="number"
                                placeholder='Enter Ticket Price here'
                                name="ticket_price"
                                value={formData.ticket_price}
                                onChange={handleChange}
                                required
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
                    <div className="flex items-center justify-between w-full">
                        <button
                            type="submit"
                            className="bg-grad w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
